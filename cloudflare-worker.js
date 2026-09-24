// ============================================================
// Cloudflare Worker — PKG App SPA Backend (SECURED) · v3
// Handles: admin login, kode aktivasi, AKUN (1 kode = 1 akun) — D1 SQLite
// Deploy: npx wrangler deploy
//
// PERUBAHAN v3 (2026-09-24) — "1 kode aktivasi = 1 AKUN":
// - Aktivasi membuat AKUN di server (username unik + password ter-hash).
// - Login pengguna diverifikasi ke server (bukan localStorage) → akun bisa
//   dipakai di perangkat mana pun.
// - Identitas (nama, madrasah, kabupaten, role) BERASAL DARI SERVER dan
//   DIKUNCI — tidak bisa diubah dari sisi klien.
// - Perangkat hanya dicatat (log), tidak lagi membatasi.
//
// KEAMANAN:
// - Admin login mengeluarkan SESSION TOKEN (HMAC-signed, 8 jam).
// - Semua route /admin/* WAJIB memiliki token valid.
// - Password akun disimpan sebagai SHA-256(salt + ':' + password) + salt acak.
// - Rate limiting per IP untuk login & aktivasi.
// - CORS dibatasi ke origin yang diizinkan.
// ============================================================

// SHA-256 hash via Web Crypto API (available in Workers)
async function sha256(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function randomSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  return sha256(salt + ':' + password);
}

// --- HMAC helpers (untuk session token) ---
function b64urlEncode(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return decodeURIComponent(escape(atob(s)));
}
async function hmac(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const SESSION_TTL_SECONDS = 8 * 3600; // 8 jam

function getAuthSecret(env) {
  return env.ADMIN_SECRET || env.ADMIN_TOKEN || '';
}

async function createSessionToken(env, username) {
  const payload = b64urlEncode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  const sig = await hmac(getAuthSecret(env), payload);
  return payload + '.' + sig;
}

async function verifySessionToken(env, token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = await hmac(getAuthSecret(env), payload);
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(b64urlDecode(payload));
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// --- CORS terbatas ---
function allowedOrigins(env) {
  return (env.ALLOWED_ORIGIN || 'https://subariyanto.github.io,https://pkg.pokjawasjember.com,http://pkg.pokjawasjember.com')
    .split(',').map(s => s.trim()).filter(Boolean);
}
function corsHeaders(request, env) {
  const base = { 'Content-Type': 'application/json', 'Vary': 'Origin' };
  const origin = request.headers.get('Origin');
  if (origin && allowedOrigins(env).includes(origin)) {
    base['Access-Control-Allow-Origin'] = origin;
  }
  base['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
  base['Access-Control-Allow-Headers'] = 'Content-Type, X-Admin-Token';
  return base;
}

// --- Rate limiting sederhana (D1) ---
async function rateLimit(env, key, max, windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + windowSeconds;
  let row;
  try {
    row = await env.DB.prepare('SELECT cnt, reset_at FROM pkg_rate_limit WHERE rkey = ?').bind(key).first();
  } catch (e) { row = null; }
  if (!row || !row.reset_at || row.reset_at < now) {
    await env.DB.prepare(
      'INSERT INTO pkg_rate_limit (rkey, cnt, reset_at) VALUES (?, ?, ?) ON CONFLICT(rkey) DO UPDATE SET cnt = ?, reset_at = ?'
    ).bind(key, 1, resetAt, 1, resetAt).run();
    return { ok: true };
  }
  if (row.cnt >= max) return { ok: false };
  await env.DB.prepare('UPDATE pkg_rate_limit SET cnt = cnt + 1 WHERE rkey = ?').bind(key).run();
  return { ok: true };
}

function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
}

const CODE_RE = /^PKG-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
const USERNAME_RE = /^[a-z0-9_.]{4,32}$/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, '');
    const headers = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (path === '' || path === 'health') {
      return json({ ok: true, service: 'pkg-backend', v: 3, time: Date.now() }, 200, headers);
    }

    try {
      // --- ADMIN LOGIN ---
      if (path === 'admin-login' && request.method === 'POST') {
        if (!getAuthSecret(env)) {
          return json({ ok: false, message: 'Admin auth belum dikonfigurasi. Hubungi Admin.' }, 500, headers);
        }
        const rl = await rateLimit(env, 'login:' + clientIp(request), 10, 300);
        if (!rl.ok) return json({ ok: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.' }, 429, headers);

        const { username, password } = await request.json();
        if (!username || !password) return json({ ok: false, message: 'Username/password wajib diisi' }, 400, headers);

        const hash = await sha256(password);
        const admin = await env.DB.prepare(
          'SELECT username, nama, role FROM pkg_admins WHERE username = ? AND password_hash = ?'
        ).bind(username, hash).first();
        if (!admin) return json({ ok: false, message: 'Username/password salah' }, 401, headers);

        const token = await createSessionToken(env, admin.username);
        return json({ ok: true, username: admin.username, nama: admin.nama, role: admin.role, token }, 200, headers);
      }

      // --- ACTIVATE ACCOUNT (user side) — 1 kode = 1 AKUN ---
      // POST /activate-account { code, username, password, device_id, user_agent }
      if (path === 'activate-account' && request.method === 'POST') {
        const rl = await rateLimit(env, 'actacc:' + clientIp(request), 20, 300);
        if (!rl.ok) return json({ ok: false, message: 'Terlalu banyak permintaan. Coba lagi nanti.' }, 429, headers);

        const body = await request.json();
        const { code, username, password, device_id, user_agent } = body;
        if (!code || !username || !password) {
          return json({ ok: false, message: 'Kode, username, dan password wajib diisi' }, 400, headers);
        }
        const codeU = String(code).trim().toUpperCase();
        const userL = String(username).trim().toLowerCase();
        if (!CODE_RE.test(codeU)) return json({ ok: false, message: 'Format kode aktivasi tidak valid' }, 400, headers);
        if (!USERNAME_RE.test(userL)) return json({ ok: false, message: 'Username 4-32 karakter (huruf kecil/angka/titik/underscore)' }, 400, headers);
        if (String(password).length < 6) return json({ ok: false, message: 'Password minimal 6 karakter' }, 400, headers);

        const row = await env.DB.prepare('SELECT * FROM pkg_activation_codes WHERE code = ?').bind(codeU).first();
        if (!row) return json({ ok: false, status: 'INVALID_CODE', message: 'Kode aktivasi tidak ditemukan' }, 404, headers);
        if (row.revoked) return json({ ok: false, status: 'REVOKED', message: 'Kode dicabut Admin' }, 403, headers);

        // Kode sudah punya akun? → tolak (1 kode = 1 akun)
        const existing = await env.DB.prepare('SELECT username FROM pkg_accounts WHERE code = ?').bind(codeU).first();
        if (existing) {
          return json({ ok: false, status: 'ALREADY_USED', message: 'Kode ini sudah dipakai untuk akun "' + existing.username + '"' }, 409, headers);
        }

        // Username sudah dipakai?
        const dup = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (dup) return json({ ok: false, status: 'USERNAME_TAKEN', message: 'Username sudah dipakai. Pilih username lain.' }, 409, headers);

        // Identitas: utamakan data dari kode (dibuat admin), fallback ke input user.
        const nama = row.nama || (body.nama ? String(body.nama).trim() : null) || null;
        const madrasah = row.madrasah || (body.madrasah ? String(body.madrasah).trim() : null) || null;
        const kabupaten = row.kabupaten || (body.kabupaten ? String(body.kabupaten).trim() : null) || null;
        const role = row.role || (body.role ? String(body.role).trim() : null) || null;

        const salt = randomSalt();
        const ph = await hashPassword(String(password), salt);
        const now = new Date().toISOString();

        await env.DB.prepare(
          'INSERT INTO pkg_accounts (code, username, password_hash, password_salt, nama, madrasah, kabupaten, role, last_login_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(codeU, userL, ph, salt, nama, madrasah, kabupaten, role, now, now, now).run();

        const acc = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (device_id && acc) {
          await env.DB.prepare(
            'INSERT INTO pkg_account_devices (account_id, device_id, user_agent, first_seen, last_seen) VALUES (?, ?, ?, ?, ?) ON CONFLICT(account_id, device_id) DO UPDATE SET last_seen = ?'
          ).bind(acc.id, device_id, user_agent || null, now, now, now).run();
        }

        // Tandai kode terpakai (kompatibilitas + statistik admin)
        await env.DB.prepare('UPDATE pkg_activation_codes SET activated = 1, activated_at = ?, device_id = ? WHERE id = ?')
          .bind(now, device_id || null, row.id).run();

        return json({
          ok: true,
          status: 'ACTIVATED',
          account: { username: userL, nama: nama, madrasah: madrasah, kabupaten: kabupaten, role: role }
        }, 200, headers);
      }

      // --- LOGIN ACCOUNT (user side) — wajib online ---
      // POST /login-account { username, password, device_id, user_agent }
      if (path === 'login-account' && request.method === 'POST') {
        const rl = await rateLimit(env, 'loginacc:' + clientIp(request), 15, 300);
        if (!rl.ok) return json({ ok: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.' }, 429, headers);

        const { username, password, device_id, user_agent } = await request.json();
        if (!username || !password) return json({ ok: false, message: 'Username dan password wajib diisi' }, 400, headers);
        const userL = String(username).trim().toLowerCase();

        const acc = await env.DB.prepare('SELECT * FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (!acc) return json({ ok: false, status: 'NO_ACCOUNT', message: 'Akun tidak ditemukan' }, 404, headers);
        if (acc.revoked) return json({ ok: false, status: 'REVOKED', message: 'Akun diblokir Admin' }, 403, headers);

        const ph = await hashPassword(String(password), acc.password_salt);
        if (ph !== acc.password_hash) return json({ ok: false, status: 'WRONG_PASSWORD', message: 'Password salah' }, 401, headers);

        const now = new Date().toISOString();
        await env.DB.prepare('UPDATE pkg_accounts SET last_login_at = ? WHERE id = ?').bind(now, acc.id).run();
        if (device_id) {
          await env.DB.prepare(
            'INSERT INTO pkg_account_devices (account_id, device_id, user_agent, first_seen, last_seen) VALUES (?, ?, ?, ?, ?) ON CONFLICT(account_id, device_id) DO UPDATE SET last_seen = ?'
          ).bind(acc.id, device_id, user_agent || null, now, now, now).run();
        }

        return json({
          ok: true,
          account: {
            username: acc.username,
            nama: acc.nama,
            madrasah: acc.madrasah,
            kabupaten: acc.kabupaten,
            role: acc.role
          }
        }, 200, headers);
      }

      // --- CLAIM ACCOUNT (migrasi akun LAMA: 1 kode = 1 perangkat → 1 kode = 1 akun) ---
      // POST /claim-account { code, username, password, device_id, user_agent }
      // Hanya bisa diklaim dari PERANGKAT YANG SAMA yang dulu mengaktivasi kode tsb
      // (device_id harus cocok dengan yang tercatat di kode).
      if (path === 'claim-account' && request.method === 'POST') {
        const rl = await rateLimit(env, 'claim:' + clientIp(request), 10, 300);
        if (!rl.ok) return json({ ok: false, message: 'Terlalu banyak permintaan. Coba lagi nanti.' }, 429, headers);

        const body = await request.json();
        const { code, username, password, device_id, user_agent } = body;
        if (!code || !username || !password || !device_id) {
          return json({ ok: false, message: 'Kode, username, password, dan perangkat wajib diisi' }, 400, headers);
        }
        const codeU = String(code).trim().toUpperCase();
        const userL = String(username).trim().toLowerCase();
        if (!CODE_RE.test(codeU)) return json({ ok: false, message: 'Format kode aktivasi tidak valid' }, 400, headers);
        if (!USERNAME_RE.test(userL)) return json({ ok: false, message: 'Username 4-32 karakter (huruf kecil/angka/titik/underscore)' }, 400, headers);
        if (String(password).length < 6) return json({ ok: false, message: 'Password minimal 6 karakter' }, 400, headers);

        const row = await env.DB.prepare('SELECT * FROM pkg_activation_codes WHERE code = ?').bind(codeU).first();
        if (!row) return json({ ok: false, status: 'INVALID_CODE', message: 'Kode aktivasi tidak ditemukan' }, 404, headers);
        if (row.revoked) return json({ ok: false, status: 'REVOKED', message: 'Kode dicabut Admin' }, 403, headers);
        if (!row.device_id || row.device_id !== device_id) {
          return json({ ok: false, status: 'DEVICE_MISMATCH', message: 'Kode ini tidak terdaftar di perangkat ini. Hubungi Admin.' }, 403, headers);
        }
        const existing = await env.DB.prepare('SELECT username FROM pkg_accounts WHERE code = ?').bind(codeU).first();
        if (existing) {
          return json({ ok: false, status: 'ALREADY_USED', message: 'Kode ini sudah punya akun "' + existing.username + '". Silakan gunakan menu Login.' }, 409, headers);
        }
        const dup = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (dup) return json({ ok: false, status: 'USERNAME_TAKEN', message: 'Username sudah dipakai. Pilih username lain.' }, 409, headers);

        const nama = row.nama || (body.nama ? String(body.nama).trim() : null) || null;
        const madrasah = row.madrasah || (body.madrasah ? String(body.madrasah).trim() : null) || null;
        const kabupaten = row.kabupaten || (body.kabupaten ? String(body.kabupaten).trim() : null) || null;
        const role = row.role || (body.role ? String(body.role).trim() : null) || null;

        const salt = randomSalt();
        const ph = await hashPassword(String(password), salt);
        const now = new Date().toISOString();
        await env.DB.prepare(
          'INSERT INTO pkg_accounts (code, username, password_hash, password_salt, nama, madrasah, kabupaten, role, last_login_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(codeU, userL, ph, salt, nama, madrasah, kabupaten, role, now, now, now).run();

        const acc = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (acc) {
          await env.DB.prepare(
            'INSERT INTO pkg_account_devices (account_id, device_id, user_agent, first_seen, last_seen) VALUES (?, ?, ?, ?, ?) ON CONFLICT(account_id, device_id) DO UPDATE SET last_seen = ?'
          ).bind(acc.id, device_id, user_agent || null, now, now, now).run();
        }

        return json({
          ok: true,
          status: 'CLAIMED',
          account: { username: userL, nama: nama, madrasah: madrasah, kabupaten: kabupaten, role: role }
        }, 200, headers);
      }

      // --- CODE DETAILS (untuk auto-isi & kunci identitas saat aktivasi) ---
      // GET /code-details?code=***
      // Hanya mengembalikan identitas bila kode valid, belum dicabut, dan belum dipakai.
      if (path === 'code-details' && request.method === 'GET') {
        const rl = await rateLimit(env, 'codedet:' + clientIp(request), 30, 300);
        if (!rl.ok) return json({ ok: false, message: 'Terlalu banyak permintaan. Coba lagi nanti.' }, 429, headers);
        const code = url.searchParams.get('code');
        if (!code) return json({ ok: false, message: 'Kode kosong' }, 400, headers);
        const codeU = code.trim().toUpperCase();
        if (!CODE_RE.test(codeU)) return json({ ok: false, status: 'INVALID_CODE', message: 'Format kode tidak valid' }, 400, headers);
        const row = await env.DB.prepare('SELECT id, nama, madrasah, kabupaten, role, revoked FROM pkg_activation_codes WHERE code = ?').bind(codeU).first();
        if (!row) return json({ ok: false, status: 'INVALID_CODE', message: 'Kode tidak ditemukan' }, 404, headers);
        if (row.revoked) return json({ ok: false, status: 'REVOKED', message: 'Kode dicabut Admin' }, 403, headers);
        const used = await env.DB.prepare('SELECT username FROM pkg_accounts WHERE code = ?').bind(codeU).first();
        if (used) return json({ ok: false, status: 'ALREADY_USED', message: 'Kode sudah dipakai akun "' + used.username + '"' }, 409, headers);
        return json({
          ok: true,
          status: 'unused',
          nama: row.nama || '',
          madrasah: row.madrasah || '',
          kabupaten: row.kabupaten || '',
          role: row.role || ''
        }, 200, headers);
      }

      // --- CHECK CODE STATUS (deprecated tapi dipertahankan) ---
      if (path === 'check-code' && request.method === 'GET') {
        const code = url.searchParams.get('code');
        if (!code) return json({ ok: false, message: 'Kode kosong' }, 400, headers);
        const codeU = code.trim().toUpperCase();
        const row = await env.DB.prepare('SELECT activated, revoked FROM pkg_activation_codes WHERE code = ?').bind(codeU).first();
        if (!row) return json({ ok: false, status: 'invalid', message: 'Kode tidak ditemukan' }, 404, headers);
        let status = 'unused';
        if (row.revoked) status = 'revoked';
        else if (row.activated) status = 'activated';
        return json({ ok: true, status }, 200, headers);
      }

      // === ADMIN PROTECTED ROUTES ===
      let session = null;
      if (path.startsWith('admin/')) {
        if (!getAuthSecret(env)) {
          return json({ ok: false, message: 'Admin auth belum dikonfigurasi' }, 500, headers);
        }
        const token = request.headers.get('X-Admin-Token');
        session = await verifySessionToken(env, token);
        if (!session) {
          return json({ ok: false, message: 'Sesi admin tidak valid atau kedaluwarsa. Silakan login ulang.' }, 401, headers);
        }
      }

      // --- ADMIN CREATE CODE ---
      if (path === 'admin/create-code' && request.method === 'POST') {
        const { nama, madrasah, kabupaten, role, catatan } = await request.json();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I,O,0,1
        function seg() {
          let s = '';
          const arr = new Uint8Array(4);
          crypto.getRandomValues(arr);
          for (let i = 0; i < 4; i++) s += chars[arr[i] % chars.length];
          return s;
        }
        const code = 'PKG-' + seg() + '-' + seg();
        const result = await env.DB.prepare(
          'INSERT INTO pkg_activation_codes (code, nama, madrasah, kabupaten, role, catatan, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(code, nama || null, madrasah || null, kabupaten || null, role || null, catatan || null, session.u).run();
        return json({ ok: true, code, id: result.meta.last_row_id }, 200, headers);
      }

      // --- ADMIN LIST CODES (dengan info akun) ---
      if (path === 'admin/list-codes' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT c.id, c.code, c.nama, c.madrasah, c.kabupaten, c.role, c.catatan, c.device_id, c.activated, c.activated_at, c.revoked, c.created_by, c.created_at, a.username AS account_username, a.madrasah AS account_madrasah, a.kabupaten AS account_kabupaten FROM pkg_activation_codes c LEFT JOIN pkg_accounts a ON a.code = c.code ORDER BY c.created_at DESC'
        ).all();
        return json({ ok: true, data: results || [] }, 200, headers);
      }

      // --- ADMIN LIST ACCOUNTS ---
      if (path === 'admin/list-accounts' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT id, code, username, nama, madrasah, kabupaten, role, revoked, last_login_at, created_at FROM pkg_accounts ORDER BY created_at DESC'
        ).all();
        return json({ ok: true, data: results || [] }, 200, headers);
      }

      // --- ADMIN RESET PASSWORD AKUN ---
      // POST /admin/reset-password { username, new_password }
      if (path === 'admin/reset-password' && request.method === 'POST') {
        const { username, new_password } = await request.json();
        if (!username || !new_password) return json({ ok: false, message: 'Username & password baru wajib' }, 400, headers);
        if (String(new_password).length < 6) return json({ ok: false, message: 'Password minimal 6 karakter' }, 400, headers);
        const userL = String(username).trim().toLowerCase();
        const acc = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (!acc) return json({ ok: false, message: 'Akun tidak ditemukan' }, 404, headers);
        const salt = randomSalt();
        const ph = await hashPassword(String(new_password), salt);
        await env.DB.prepare('UPDATE pkg_accounts SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?')
          .bind(ph, salt, new Date().toISOString(), acc.id).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN EDIT AKUN (identitas terkunci → hanya admin yang boleh ubah) ---
      // POST /admin/edit-account { username, nama, madrasah, kabupaten, role }
      if (path === 'admin/edit-account' && request.method === 'POST') {
        const { username, nama, madrasah, kabupaten, role } = await request.json();
        if (!username) return json({ ok: false, message: 'Username wajib' }, 400, headers);
        const userL = String(username).trim().toLowerCase();
        await env.DB.prepare('UPDATE pkg_accounts SET nama = ?, madrasah = ?, kabupaten = ?, role = ?, updated_at = ? WHERE username = ?')
          .bind(nama || null, madrasah || null, kabupaten || null, role || null, new Date().toISOString(), userL).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN REVOKE / BLOKIR AKUN ---
      // POST /admin/revoke-account { username }
      if (path === 'admin/revoke-account' && request.method === 'POST') {
        const { username } = await request.json();
        if (!username) return json({ ok: false, message: 'Username wajib' }, 400, headers);
        await env.DB.prepare('UPDATE pkg_accounts SET revoked = 1 WHERE username = ?').bind(String(username).trim().toLowerCase()).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN AKTIFKAN KEMBALI AKUN ---
      if (path === 'admin/unrevoke-account' && request.method === 'POST') {
        const { username } = await request.json();
        if (!username) return json({ ok: false, message: 'Username wajib' }, 400, headers);
        await env.DB.prepare('UPDATE pkg_accounts SET revoked = 0 WHERE username = ?').bind(String(username).trim().toLowerCase()).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN DELETE AKUN ---
      if (path === 'admin/delete-account' && request.method === 'POST') {
        const { username } = await request.json();
        if (!username) return json({ ok: false, message: 'Username wajib' }, 400, headers);
        const userL = String(username).trim().toLowerCase();
        const acc = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(userL).first();
        if (acc) {
          await env.DB.prepare('DELETE FROM pkg_account_devices WHERE account_id = ?').bind(acc.id).run();
          await env.DB.prepare('DELETE FROM pkg_accounts WHERE id = ?').bind(acc.id).run();
        }
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN DEVICES AKUN ---
      if (path === 'admin/account-devices' && request.method === 'GET') {
        const username = (url.searchParams.get('username') || '').trim().toLowerCase();
        if (!username) return json({ ok: false, message: 'Username wajib' }, 400, headers);
        const acc = await env.DB.prepare('SELECT id FROM pkg_accounts WHERE username = ?').bind(username).first();
        if (!acc) return json({ ok: false, message: 'Akun tidak ditemukan' }, 404, headers);
        const { results } = await env.DB.prepare(
          'SELECT device_id, user_agent, first_seen, last_seen FROM pkg_account_devices WHERE account_id = ? ORDER BY last_seen DESC'
        ).bind(acc.id).all();
        return json({ ok: true, data: results || [] }, 200, headers);
      }

      // --- ADMIN REVOKE CODE ---
      if (path === 'admin/revoke-code' && request.method === 'POST') {
        const { id } = await request.json();
        await env.DB.prepare('UPDATE pkg_activation_codes SET revoked = 1 WHERE id = ?').bind(id).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN EDIT CODE ---
      if (path === 'admin/edit-code' && request.method === 'POST') {
        const { id, nama, madrasah, kabupaten, role, catatan } = await request.json();
        await env.DB.prepare(
          'UPDATE pkg_activation_codes SET nama = ?, madrasah = ?, kabupaten = ?, role = ?, catatan = ? WHERE id = ?'
        ).bind(nama || null, madrasah || null, kabupaten || null, role || null, catatan || null, id).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN DELETE CODE ---
      if (path === 'admin/delete-code' && request.method === 'POST') {
        const { id } = await request.json();
        await env.DB.prepare('DELETE FROM pkg_activation_codes WHERE id = ?').bind(id).run();
        return json({ ok: true }, 200, headers);
      }

      // --- ADMIN DELETE ALL UNUSED CODES ---
      if (path === 'admin/delete-all-codes' && request.method === 'POST') {
        const result = await env.DB.prepare('DELETE FROM pkg_activation_codes WHERE activated = 0 AND revoked = 0').run();
        return json({ ok: true, deleted: result.meta?.changes || 0 }, 200, headers);
      }

      // --- ADMIN STATS ---
      if (path === 'admin/stats' && request.method === 'GET') {
        const total = await env.DB.prepare('SELECT COUNT(*) as c FROM pkg_activation_codes').first();
        const unused = await env.DB.prepare('SELECT COUNT(*) as c FROM pkg_activation_codes WHERE activated = 0 AND revoked = 0').first();
        const activated = await env.DB.prepare('SELECT COUNT(*) as c FROM pkg_activation_codes WHERE activated = 1').first();
        const revoked = await env.DB.prepare('SELECT COUNT(*) as c FROM pkg_activation_codes WHERE revoked = 1').first();
        let accounts = { c: 0 }, blocked = { c: 0 };
        try { accounts = await env.DB.prepare('SELECT COUNT(*) as c FROM pkg_accounts').first(); } catch (e) {}
        try { blocked = await env.DB.prepare('SELECT COUNT(*) as c FROM pkg_accounts WHERE revoked = 1').first(); } catch (e) {}
        return json({
          ok: true,
          total: total?.c || 0,
          unused: unused?.c || 0,
          activated: activated?.c || 0,
          revoked: revoked?.c || 0,
          accounts: accounts?.c || 0,
          blocked: blocked?.c || 0
        }, 200, headers);
      }

      return json({ ok: false, message: 'Endpoint tidak ditemukan: ' + path }, 404, headers);
    } catch (e) {
      return json({ ok: false, message: 'Server error: ' + e.message }, 500, headers);
    }
  }
};

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers)
  });
}
