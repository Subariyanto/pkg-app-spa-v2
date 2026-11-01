// pkg-sync.js — Sinkronisasi data penilaian PKG ke server VPS (per akun)
// Dibuat: 1 Nov 2026 · Revisi 2 (1 Nov 2026, 13:5x) — perbaikan setelah audit:
//   [FIX-1] Peta scope -> key localStorage eksplisit. Sebelumnya key ditebak dari
//           nama scope, sehingga `penggalian` selalu membaca pkg_v1_penggalian
//           (padahal db.js menyimpan di pkg_v1_penggalian_data) → tidak pernah tersinkron.
//   [FIX-2] Checksum lokal vs server tidak pernah cocok (FNV vs sha256 server),
//           akibatnya setiap pull mengunggah ulang semua scope. Sekarang perbandingan
//           memakai hash kanonik atas isi payload dari kedua sisi.
//   [FIX-3] Penghapusan data tidak lagi "dihidupkan lagi" oleh server: array kosong
//           tetap dikirim (dulu dianggap "kosong → dilewati"), dengan penanda waktu
//           ubah lokal (local_ts) untuk menentukan pemenang konflik.
//   [FIX-4] Sinkronisasi tidak lagi hanya saat login: ada auto-pull saat aplikasi
//           dibuka, saat tab kembali aktif, saat jaringan pulih, dan tiap 3 menit.
//   [FIX-5] Antrean kirim disimpan di localStorage → tidak hilang saat aplikasi ditutup.
//   [FIX-6] Status sinkron selalu dilaporkan (berhasil/gagal/sesi habis) supaya
//           pengguna tahu kalau data belum terkirim.
//
// Prinsip:
// - localStorage TETAP sumber utama saat offline. Aplikasi tidak berubah perilaku
//   kalau tidak ada internet.
// - Setiap bagian data (scope) disimpan terpisah ke server.
// - Perangkat baru login → tarik semua scope dari server.
// - Setiap perubahan lokal → kirim scope terkait (debounce 2,5 detik).
// - Perangkat yang punya data lokal tapi server masih kosong → data lokal diunggah
//   (migrasi otomatis pengguna lama, tanpa perlu export/import manual).
//
// Konflik: menang yang paling baru (local_ts perubahan lokal vs updated_at server).

(function () {
  'use strict';

  var SYNC_META_KEY = 'pkg_sync_meta_v1';       // { scope: { updated_at, local_checksum, local_ts, size } }
  var PENDING_KEY = 'pkg_sync_pending_v1';      // [scope, ...] antrean kirim yang belum tuntas
  var PUSH_DELAY = 2500;                        // debounce kirim
  var PULL_MIN_GAP = 20000;                     // jarak minimal antar auto-pull (ms)
  var PULL_INTERVAL = 180000;                   // auto-pull berkala saat aplikasi terbuka (3 menit)

  // [FIX-1] scope → key localStorage sebenarnya (mengikuti KEYS di db.js)
  var SCOPE_KEY = {
    guru: 'pkg_v1_guru',
    kamad: 'pkg_v1_kamad',
    penilaian: 'pkg_v1_penilaian',
    skor: 'pkg_v1_skor',
    kehadiran: 'pkg_v1_kehadiran',
    pkb: 'pkg_v1_pkb',
    meta: 'pkg_v1_meta',
    instrumen_overrides: 'pkg_v1_instrumen_overrides',
    kompetensi_overrides: 'pkg_v1_kompetensi_overrides',
    penggalian: 'pkg_v1_penggalian_data',
    periode: 'pkg_v1_periode',
    periode_active: 'pkg_v1_periode_active',
    logo: 'pkg_v1_logo',
    dok_identitas: 'pkg_v1_dok_identitas'
  };
  var SCOPES = Object.keys(SCOPE_KEY);

  var pending = {};        // scope -> true (perlu dikirim)
  var pushTimer = null;
  var pushing = false;
  var pulling = null;      // promise pull yang sedang jalan (anti tumpang tindih)
  var lastPullAt = 0;
  var lastStatus = { ok: null, message: 'idle', at: null };
  var listeners = [];

  function client() {
    return window.SupabaseSync || null;
  }

  function ready() {
    var c = client();
    return !!(c && c.hasConfig && c.hasConfig() && c.dataSet && c.dataGet &&
              c.hasAccountToken && c.hasAccountToken());
  }

  function loadMeta() {
    try { return JSON.parse(localStorage.getItem(SYNC_META_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveMeta(m) {
    try { localStorage.setItem(SYNC_META_KEY, JSON.stringify(m)); } catch (e) {}
  }

  // [FIX-5] antrean kirim dipersist supaya tidak hilang saat aplikasi ditutup
  function loadPending() {
    try {
      var arr = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
      if (Array.isArray(arr)) for (var i = 0; i < arr.length; i++) {
        if (SCOPES.indexOf(arr[i]) !== -1) pending[arr[i]] = true;
      }
    } catch (e) {}
  }
  function savePending() {
    try { localStorage.setItem(PENDING_KEY, JSON.stringify(Object.keys(pending))); } catch (e) {}
  }

  function dbKey(scope) {
    return SCOPE_KEY[scope] || ('pkg_v1_' + scope);
  }

  function readRaw(scope) {
    try { return localStorage.getItem(dbKey(scope)); } catch (e) { return null; }
  }

  function parseRaw(raw) {
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function readLocal(scope) { return parseRaw(readRaw(scope)); }

  function writeLocal(scope, val) {
    try { localStorage.setItem(dbKey(scope), JSON.stringify(val)); return true; }
    catch (e) { console.error('pkg-sync write gagal', scope, e); return false; }
  }

  // Simpan salinan data lokal SEBELUM ditimpa data server.
  // Tujuannya: kalau ternyata server lebih lama, data pengguna tidak hilang
  // dan masih bisa dipulihkan (menu Backup atau manual dari console).
  function backupLocal(scope) {
    try {
      var cur = readRaw(scope);
      if (!cur || cur === 'null') return;
      var stamp = new Date().toISOString().replace(/[:.]/g, '-');
      localStorage.setItem('pkg_sync_backup_' + scope + '_' + stamp, cur);
      // sisakan maksimal 3 salinan terbaru per scope
      var pref = 'pkg_sync_backup_' + scope + '_';
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(pref) === 0) keys.push(k);
      }
      keys.sort();
      while (keys.length > 3) { localStorage.removeItem(keys.shift()); }
    } catch (e) {}
  }

  function writeLocalFromServer(scope, val) {
    if (readRaw(scope) !== null) backupLocal(scope);
    return writeLocal(scope, val);
  }

  // JSON kanonik (key diurutkan) → hash stabil untuk kedua sisi
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) {
      var parts = [];
      for (var i = 0; i < v.length; i++) parts.push(canon(v[i]));
      return '[' + parts.join(',') + ']';
    }
    var ks = Object.keys(v).sort();
    var out = [];
    for (var j = 0; j < ks.length; j++) out.push(JSON.stringify(ks[j]) + ':' + canon(v[ks[j]]));
    return '{' + out.join(',') + '}';
  }

  // Hash ringan (FNV-1a 32-bit) atas bentuk kanonik
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16);
  }

  function hashVal(v) { return hash(canon(v)); }

  function isEmpty(v) {
    if (v === null || v === undefined) return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function notify(status) {
    lastStatus = status;
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](status); } catch (e) {}
    }
    try { window.dispatchEvent(new CustomEvent('pkg-sync-status', { detail: status })); } catch (e) {}
  }

  function deviceId() {
    try { return localStorage.getItem('pkg_device_id') || ''; } catch (e) { return ''; }
  }

  // --- KIRIM SATU SCOPE ---
  async function pushScope(scope) {
    var c = client();
    if (!c || !ready()) return { ok: false, reason: 'not-ready' };
    var raw = readRaw(scope);
    if (raw === null) return { ok: true, skipped: true };   // perangkat ini memang tak punya data scope tsb
    var payload = parseRaw(raw);
    if (payload === null) return { ok: true, skipped: true };

    var res = await c.dataSet(scope, payload, 0, deviceId());
    if (res && res.ok) {
      var meta = loadMeta();
      var prev = meta[scope] || {};
      meta[scope] = {
        updated_at: res.updated_at || new Date().toISOString(),
        local_checksum: hashVal(payload),
        local_ts: prev.local_ts || 0,
        size: res.size_bytes || 0
      };
      saveMeta(meta);
      return { ok: true };
    }
    if (res && (res.status === 'SESSION_EXPIRED' || res.status === 'NO_SESSION')) {
      notify({ ok: false, message: 'Sesi login berakhir — silakan login ulang', expired: true, at: Date.now() });
    }
    return { ok: false, res: res };
  }

  // --- KIRIM SEMUA YANG TERTUNDA ---
  async function flush() {
    if (pushing) return { ok: false, reason: 'busy' };
    if (!ready()) return { ok: false, reason: 'not-ready' };
    var scopes = Object.keys(pending);
    if (!scopes.length) return { ok: true, sent: 0 };
    pushing = true;
    var failed = [];
    try {
      for (var i = 0; i < scopes.length; i++) {
        var s = scopes[i];
        var r = await pushScope(s);
        if (r && r.ok) delete pending[s];
        else failed.push(s);
      }
    } finally {
      pushing = false;
    }
    savePending();
    if (failed.length) {
      notify({ ok: false, message: 'Sebagian data belum terkirim (jaringan?)', pending: failed.length, at: Date.now() });
      return { ok: false, sent: scopes.length - failed.length, failed: failed };
    }
    notify({ ok: true, message: 'Data tersimpan di server', at: Date.now() });
    return { ok: true, sent: scopes.length };
  }

  function schedulePush(scope) {
    if (scope && SCOPES.indexOf(scope) === -1) return;
    if (!ready()) {
      // tetap catat supaya dikirim setelah login/jaringan pulih
      if (scope) pending[scope] = true;
      savePending();
      return;
    }
    var meta = loadMeta();
    var now = Date.now();
    if (scope) {
      pending[scope] = true;
      meta[scope] = meta[scope] || {};
      meta[scope].local_ts = now;      // [FIX-3] waktu ubah lokal = penentu konflik
      saveMeta(meta);
    } else {
      for (var i = 0; i < SCOPES.length; i++) {
        pending[SCOPES[i]] = true;
        meta[SCOPES[i]] = meta[SCOPES[i]] || {};
        meta[SCOPES[i]].local_ts = now;
      }
      saveMeta(meta);
    }
    savePending();
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; flush(); }, PUSH_DELAY);
  }

  // --- TARIK DARI SERVER ---
  // Mengembalikan { ok, applied, uploaded, errors, reason }
  async function pullAll() {
    if (pulling) return pulling;              // anti tumpang tindih
    var c = client();
    if (!c || !ready()) return { ok: false, reason: 'not-ready', applied: 0, uploaded: 0 };
    pulling = (async function () {
      var res = await c.dataGet(null);
      if (!res || !res.ok) {
        if (res && (res.status === 'SESSION_EXPIRED' || res.status === 'NO_SESSION')) {
          notify({ ok: false, message: 'Sesi login berakhir — silakan login ulang', expired: true, at: Date.now() });
        }
        return { ok: false, reason: (res && res.status) || 'error', applied: 0, uploaded: 0 };
      }
      var rows = res.rows || [];
      var byScope = {};
      for (var i = 0; i < rows.length; i++) byScope[rows[i].scope] = rows[i];

      var meta = loadMeta();
      var applied = 0, uploaded = 0, errors = [], conflicts = [];

      for (var j = 0; j < SCOPES.length; j++) {
        var scope = SCOPES[j];
        var raw = readRaw(scope);
        var local = parseRaw(raw);
        var srv = byScope[scope];
        var m = meta[scope] || {};

        if (!srv) {
          // Server belum punya → unggah data lokal (migrasi otomatis pengguna lama)
          if (raw !== null && !isEmpty(local)) {
            var up = await pushScope(scope);
            if (up && up.ok && !up.skipped) { uploaded++; delete pending[scope]; }
            else if (up && !up.ok) errors.push(scope);
          }
          continue;
        }

        // Perangkat ini belum punya scope tersebut → ambil dari server
        if (raw === null) {
          if (writeLocalFromServer(scope, srv.payload)) {
            meta[scope] = {
              updated_at: srv.updated_at || null,
              local_checksum: hashVal(srv.payload),
              local_ts: 0,
              size: srv.size_bytes || 0
            };
            applied++;
          } else errors.push(scope);
          continue;
        }

        // Isi sama → tidak perlu apa-apa
        var localHash = hashVal(local);
        var srvHash = hashVal(srv.payload);
        if (localHash === srvHash) {
          meta[scope] = {
            updated_at: srv.updated_at || m.updated_at || null,
            local_checksum: localHash,
            local_ts: m.local_ts || 0,
            size: srv.size_bytes || 0
          };
          delete pending[scope];
          continue;
        }

        var localTs = Number(m.local_ts || 0);
        var srvTs = Date.parse(srv.updated_at || 0) || 0;

        // Ada ubahan lokal yang lebih baru dari versi server → kirim lokal
        if (localTs && localTs > srvTs + 500) {
          var up2 = await pushScope(scope);
          if (up2 && up2.ok && !up2.skipped) { uploaded++; delete pending[scope]; }
          else if (up2 && !up2.ok) errors.push(scope);
          continue;
        }

        // Server lebih baru (atau perangkat ini belum pernah sinkron scope ini)
        // → ambil server, tapi simpan dulu salinan lokal supaya tidak hilang.
        if (writeLocalFromServer(scope, srv.payload)) {
          meta[scope] = {
            updated_at: srv.updated_at || null,
            local_checksum: srvHash,
            local_ts: 0,
            size: srv.size_bytes || 0
          };
          applied++;
          conflicts.push(scope);
        } else errors.push(scope);
      }

      saveMeta(meta);
      savePending();
      if (applied || uploaded) {
        notify({
          ok: errors.length === 0,
          message: (applied ? applied + ' bagian diambil dari server' : '') +
                   (uploaded ? (applied ? ', ' : '') + uploaded + ' bagian diunggah' : ''),
          applied: applied, uploaded: uploaded, conflicts: conflicts, at: Date.now()
        });
      }
      return { ok: true, applied: applied, uploaded: uploaded, conflicts: conflicts, errors: errors };
    })();
    try {
      return await pulling;
    } finally {
      pulling = null;
      lastPullAt = Date.now();
    }
  }

  // --- [FIX-4] AUTO PULL ---
  // Dipanggil saat aplikasi dibuka / tab kembali aktif / jaringan pulih.
  async function autoPull(opts) {
    var force = !!(opts && opts.force);
    if (!ready()) return { ok: false, reason: 'not-ready' };
    if (!force && Date.now() - lastPullAt < PULL_MIN_GAP) return { ok: false, reason: 'throttled' };
    // Tarik dulu (pullAll menyelesaikan konflik per scope dengan local_ts), baru
    // kirim sisa antrean. Urutan ini mencegah antrean lama perangkat baru menimpa
    // data server yang justru lebih baru.
    var r = await pullAll();
    try { if (Object.keys(pending).length) await flush(); } catch (e) {}
    if (r && r.applied > 0) {
      try { window.dispatchEvent(new CustomEvent('pkg-sync-applied', { detail: r })); } catch (e) {}
    }
    return r;
  }

  // --- DETEKSI PERUBAHAN LOKAL (hook dari db.js) ---
  function onChange(scope) { schedulePush(scope); }

  function onSaveEvent(ev) {
    var scope = ev && ev.detail && ev.detail.scope;
    if (scope) schedulePush(scope);
  }

  function addListener(fn) { listeners.push(fn); }
  function status() { return lastStatus; }
  function pendingCount() { return Object.keys(pending).length; }
  function scopes() { return SCOPES.slice(); }

  // Antrean lama dipulihkan
  loadPending();

  // Jaringan pulih → kirim sisa + tarik data terbaru
  window.addEventListener('online', function () {
    schedulePush(null);
    autoPull({ force: true });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { flush(); return; }
    autoPull();
  });

  window.addEventListener('pageshow', function () { autoPull(); });

  // Saat aplikasi dibuka: kasih waktu komponen lain siap, lalu tarik data
  function bootPull() { setTimeout(function () { autoPull({ force: true }); }, 800); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') bootPull();
  else document.addEventListener('DOMContentLoaded', bootPull);

  // Jaring pengaman: cek berkala selama aplikasi terbuka
  setInterval(function () {
    if (document.visibilityState === 'hidden') return;
    autoPull();
  }, PULL_INTERVAL);

  window.PKGSync = {
    SCOPES: SCOPES,
    scopes: scopes,
    ready: ready,
    pullAll: pullAll,
    autoPull: autoPull,
    flush: flush,
    schedulePush: schedulePush,
    pushScope: pushScope,
    onChange: onChange,
    addListener: addListener,
    status: status,
    pendingCount: pendingCount
  };

  // Pasang listener event dari db.js (kalau db.js sudah dimuat lebih dulu)
  window.addEventListener('pkg-local-save', onSaveEvent);
})();
