// Uji E2E sinkronisasi PKG dengan backend TIRUAN (lokal) — tidak menyentuh server produksi.
// Kontrak API meniru pkg-api VPS: login-account / data-set / data-get / data-del
// dengan header X-Account-Token.
//
// Jalankan: node test-sync-local.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import http from 'node:http';
import crypto from 'node:crypto';

// ---------------- backend tiruan ----------------
const ACCOUNTS = new Map([['zz_uji', { password: 'uji12345', name: 'Uji Sync' }]]);
const TOKENS = new Map();                       // token -> username
const DATA = new Map();                         // `${user}|${scope}` -> { payload, updated_at }
let clock = Date.parse('2026-11-01T00:00:00Z');
const tick = () => new Date(clock += 1000).toISOString();

function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }
function canon(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
}

function body(req) {
  return new Promise(res => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => { try { res(JSON.parse(b || '{}')); } catch { res({}); } });
  });
}
const jsonResp = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/functions\/v1\/pkg-api\//, '').replace(/^\//, '');
  const acc = req.headers['x-account-token'];
  const user = acc ? TOKENS.get(acc) : null;

  if (path === 'login-account' && req.method === 'POST') {
    const b = await body(req);
    const a = ACCOUNTS.get(String(b.username || '').toLowerCase());
    if (!a || a.password !== b.password) return jsonResp(res, 404, { ok: false, status: 'NO_ACCOUNT', message: 'Akun tidak ditemukan' });
    const tok = crypto.randomUUID() + crypto.randomUUID();
    TOKENS.set(tok, String(b.username).toLowerCase());
    return jsonResp(res, 200, { ok: true, token: tok, account: { username: b.username, nama: a.name, role: 'pengawas' } });
  }

  const needAuth = ['data-set', 'data-get', 'data-list', 'data-del'];
  if (needAuth.includes(path) && !user) {
    return jsonResp(res, 401, { ok: false, status: 'SESSION_EXPIRED', message: 'Sesi tidak valid atau kedaluwarsa. Silakan login ulang.' });
  }

  if (path === 'data-set' && req.method === 'POST') {
    const b = await body(req);
    const scope = b.scope;
    const payload = b.payload;
    const size = Buffer.byteLength(JSON.stringify(payload));
    const at = tick();
    DATA.set(`${user}|${scope}`, { payload, updated_at: at, size_bytes: size, checksum: sha256(canon(payload)) });
    return jsonResp(res, 200, { ok: true, scope, size_bytes: size, updated_at: at });
  }

  if (path === 'data-list' && req.method === 'GET') {
    const rows = [];
    for (const [k, v] of DATA) {
      const [u, scope] = k.split('|');
      if (u !== user) continue;
      rows.push({ scope, periode: 0, checksum: v.checksum, size_bytes: v.size_bytes, updated_at: v.updated_at });
    }
    return jsonResp(res, 200, { ok: true, rows });
  }

  if (path === 'data-get' && req.method === 'GET') {
    const only = url.searchParams.get('scope');
    const rows = [];
    for (const [k, v] of DATA) {
      const [u, scope] = k.split('|');
      if (u !== user) continue;
      if (only && scope !== only) continue;
      rows.push({ scope, periode: 0, payload: v.payload, checksum: v.checksum, size_bytes: v.size_bytes, updated_at: v.updated_at });
    }
    return jsonResp(res, 200, { ok: true, rows });
  }

  if (path === 'data-del' && req.method === 'POST') {
    const b = await body(req);
    DATA.delete(`${user}|${b.scope}`);
    return jsonResp(res, 200, { ok: true });
  }

  return jsonResp(res, 404, { ok: false, message: 'Endpoint tidak ditemukan: ' + path });
});

await new Promise(r => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;
const REAL = 'https://api.pokjawasjember.com';
console.log(`Backend tiruan jalan di 127.0.0.1:${PORT}\n`);

// ---------------- perangkat tiruan ----------------
function makeDevice(name) {
  const store = new Map();
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    clear: () => store.clear(),
    key: i => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
  const listeners = {};
  const win = {
    localStorage,
    addEventListener: (t, f) => { (listeners[t] ||= []).push(f); },
    removeEventListener: () => {},
    dispatchEvent: ev => { (listeners[ev.type] || []).forEach(f => f(ev)); return true; },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
  };
  const doc = {
    addEventListener: () => {},
    removeEventListener: () => {},
    visibilityState: 'visible',
    readyState: 'complete',
    getElementById: () => null,
    querySelector: () => null,
  };
  const rewrite = u => String(u).replace(REAL, `http://127.0.0.1:${PORT}`);
  const ctx = {
    window: win, document: doc, localStorage,
    fetch: (u, o) => fetch(rewrite(u), o),
    console, setTimeout, clearTimeout, setInterval: () => 0, clearInterval,
    Promise, JSON, Date, Math, Uint8Array, TextEncoder, TextDecoder, atob, btoa,
    Array, Object, String, Number, Error, RegExp,
    navigator: { userAgent: 'test-' + name },
    CustomEvent: win.CustomEvent,
    URL, encodeURIComponent, decodeURIComponent,
  };
  ctx.window.window = win;
  ctx.window.navigator = ctx.navigator;
  ctx.globalThis = ctx;
  return { ctx, store, name };
}
function loadInto(dev, files) {
  const context = vm.createContext(dev.ctx);
  for (const f of files) vm.runInContext(fs.readFileSync(new URL(f, import.meta.url), 'utf8'), context, { filename: f });
  return dev.ctx;
}

const c = v => (Array.isArray(v) ? '[' + v.map(c).join(',') + ']' : (v && typeof v === 'object')
  ? '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + c(v[k])).join(',') + '}' : JSON.stringify(v));

let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'} — ${msg}`); };

const FILES = ['./cloudflare_sync.js', './pkg-sync.js'];

// ===== Perangkat A: pengguna lama, sudah punya data lokal =====
const A = makeDevice('A');
loadInto(A, FILES);
A.store.set('pkg_v1_guru', JSON.stringify([{ id: 1, nama: 'Ahmad Fauzi', nip: '198001012005011001' }]));
A.store.set('pkg_v1_penilaian', JSON.stringify([{ id: 1, guru_id: 1, periode: 2026 }]));
A.store.set('pkg_v1_skor', JSON.stringify([{ id: 1, penilaian_id: 1, indikator_id: 'I1', skor: 4 }]));
A.store.set('pkg_v1_periode_active', JSON.stringify(2026));
A.store.set('pkg_v1_penggalian_data', JSON.stringify({ 1: { catatan: 'hasil wawancara' } }));

const loginA = await A.ctx.window.SupabaseSync.loginAccount('zz_uji', 'uji12345', 'DEV-A', 'ua-A');
check(loginA.ok === true, 'A: login berhasil');

const pullA = await A.ctx.window.PKGSync.pullAll();
check(pullA.ok === true && pullA.uploaded >= 5, `A: 5 bagian data lokal terunggah (uploaded=${pullA.uploaded})`);
check(DATA.has('zz_uji|penggalian'), 'A: [FIX-1] scope penggalian ikut terkirim (dulu selalu kosong)');
check(JSON.parse(JSON.stringify(DATA.get('zz_uji|penggalian').payload))['1'].catatan === 'hasil wawancara', 'A: isi penggalian benar');

// pull kedua tidak boleh mengunggah ulang (dulu selalu unggah ulang karena checksum beda algoritma)
const pullA2 = await A.ctx.window.PKGSync.pullAll();
check(pullA2.uploaded === 0 && pullA2.applied === 0, `A: [FIX-2] pull berikutnya tidak mengunggah ulang (uploaded=${pullA2.uploaded})`);

// ===== Perangkat B: perangkat baru, kosong =====
const B = makeDevice('B');
loadInto(B, FILES);
const loginB = await B.ctx.window.SupabaseSync.loginAccount('zz_uji', 'uji12345', 'DEV-B', 'ua-B');
check(loginB.ok === true, 'B: login akun sama berhasil');
const pullB = await B.ctx.window.PKGSync.pullAll();
check(pullB.ok === true && pullB.applied >= 5, `B: data ditarik dari server (applied=${pullB.applied})`);
check(JSON.parse(B.store.get('pkg_v1_guru')).length === 1, 'B: data guru masuk');
check(JSON.parse(B.store.get('pkg_v1_skor'))[0].skor === 4, 'B: data skor masuk');
check(JSON.parse(B.store.get('pkg_v1_penggalian_data'))['1'].catatan === 'hasil wawancara', 'B: [FIX-1] data penggalian ikut pindah');
check(JSON.parse(B.store.get('pkg_v1_periode_active')) === 2026, 'B: periode aktif ikut pindah');

// ===== B mengubah data lewat event db.js =====
const guruB = [...JSON.parse(B.store.get('pkg_v1_guru')), { id: 2, nama: 'Siti Aminah', nip: '198502022010012002' }];
B.store.set('pkg_v1_guru', JSON.stringify(guruB));
B.ctx.window.dispatchEvent(new B.ctx.window.CustomEvent('pkg-local-save', { detail: { scope: 'guru', key: 'pkg_v1_guru' } }));
const flushB = await B.ctx.window.PKGSync.flush();
check(flushB.sent >= 1, `B: perubahan terkirim lewat hook db.js (sent=${flushB.sent})`);

const pullA3 = await A.ctx.window.PKGSync.autoPull({ force: true });
check(JSON.parse(A.store.get('pkg_v1_guru')).length === 2, 'A: menerima tambahan guru dari B');

// ===== [FIX-3] penghapusan data ikut tersinkron (dulu malah dihidupkan lagi server) =====
A.store.set('pkg_v1_skor', JSON.stringify([]));
A.ctx.window.dispatchEvent(new A.ctx.window.CustomEvent('pkg-local-save', { detail: { scope: 'skor', key: 'pkg_v1_skor' } }));
await A.ctx.window.PKGSync.flush();
const pullB2 = await B.ctx.window.PKGSync.autoPull({ force: true });
check(Array.isArray(JSON.parse(B.store.get('pkg_v1_skor'))) && JSON.parse(B.store.get('pkg_v1_skor')).length === 0,
  `B: skor yang dikosongkan di A ikut terhapus (B=${JSON.stringify(JSON.parse(B.store.get('pkg_v1_skor')))})`);

// ===== [FIX-6] status sesi habis dilaporkan =====
const S = makeDevice('S');
loadInto(S, FILES);
const expired = await S.ctx.window.PKGSync.autoPull({ force: true });
check(expired.ok === false && expired.reason === 'not-ready', 'S: tanpa login tidak menarik/menulis data (aman)');

// ===== [FIX-5] antrean tertunda bertahan setelah aplikasi ditutup =====
const D = makeDevice('D');
loadInto(D, FILES);
D.store.set('pkg_v1_guru', JSON.stringify([{ id: 9, nama: 'Antrean' }]));
D.ctx.window.dispatchEvent(new D.ctx.window.CustomEvent('pkg-local-save', { detail: { scope: 'guru' } }));
const queued = JSON.parse(D.store.get('pkg_sync_pending_v1') || '[]');
check(queued.includes('guru'), `D: perubahan saat belum login masuk antrean tersimpan (${queued.join(',')})`);

// perangkat yang sama login belakangan → antrean terkirim
await D.ctx.window.SupabaseSync.loginAccount('zz_uji', 'uji12345', 'DEV-D', 'ua-D');
await D.ctx.window.PKGSync.flush();
const srvGuruD = DATA.has('zz_uji|guru') ? JSON.parse(JSON.stringify(DATA.get('zz_uji|guru').payload)) : [];
check(Array.isArray(srvGuruD) && srvGuruD.length > 0 && srvGuruD[srvGuruD.length - 1].nama === 'Antrean',
  `D: antrean lama terkirim setelah login (server=${srvGuruD.map(g => g.nama).join('|')})`);
check(JSON.parse(D.store.get('pkg_sync_pending_v1') || '[]').length === 0, 'D: antrean bersih setelah terkirim');

server.close();
console.log(fail === 0 ? '\nSEMUA UJI LULUS' : `\n${fail} UJI GAGAL`);
process.exit(fail === 0 ? 0 : 1);
