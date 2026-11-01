// pkg-sync.js — Sinkronisasi data penilaian PKG ke server VPS (per akun)
// Dibuat: 1 Nov 2026
//
// Prinsip:
// - localStorage TETAP sumber utama saat offline. Aplikasi tidak berubah perilaku
//   kalau tidak ada internet.
// - Setiap bagian data (scope) disimpan terpisah ke server: guru, kamad, penilaian,
//   skor, kehadiran, pkb, meta, instrumen_overrides, kompetensi_overrides,
//   penggalian, periode, periode_active, logo, dok_identitas.
// - Setelah login di perangkat baru → tarik semua scope dari server.
// - Setiap perubahan lokal → kirim scope terkait (debounce 2,5 detik).
// - Perangkat yang punya data lokal tapi server masih kosong → data lokal diunggah
//   (migrasi otomatis pengguna lama, tanpa perlu export/import manual).
//
// Konflik: menang yang paling baru (updated_at server vs waktu ubah lokal).

(function () {
  'use strict';

  var SYNC_META_KEY = 'pkg_sync_meta_v1';   // { scope: { updated_at, checksum } }
  var PUSH_DELAY = 2500;                    // debounce kirim
  var SCOPES = [
    'guru', 'kamad', 'penilaian', 'skor', 'kehadiran', 'pkb', 'meta',
    'instrumen_overrides', 'kompetensi_overrides', 'penggalian',
    'periode', 'periode_active', 'logo', 'dok_identitas'
  ];

  var pending = {};        // scope -> true (perlu dikirim)
  var pushTimer = null;
  var pushing = false;
  var lastStatus = { ok: null, message: 'idle', at: null };
  var listeners = [];

  function client() {
    return window.SupabaseSync || null;
  }

  function ready() {
    var c = client();
    return !!(c && c.hasConfig && c.hasConfig() && c.dataSet && c.hasAccountToken && c.hasAccountToken());
  }

  function loadMeta() {
    try { return JSON.parse(localStorage.getItem(SYNC_META_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveMeta(m) {
    try { localStorage.setItem(SYNC_META_KEY, JSON.stringify(m)); } catch (e) {}
  }

  function dbKey(scope) {
    return 'pkg_v1_' + scope;
  }

  function readLocal(scope) {
    try {
      var raw = localStorage.getItem(dbKey(scope));
      return raw === null ? null : JSON.parse(raw);
    } catch (e) { return null; }
  }

  function writeLocal(scope, val) {
    try { localStorage.setItem(dbKey(scope), JSON.stringify(val)); return true; }
    catch (e) { console.error('pkg-sync write gagal', scope, e); return false; }
  }

  // Simpan salinan data lokal SEBELUM ditimpa data server.
  // Tujuannya: kalau ternyata server lebih lama, data pengguna tidak hilang
  // dan masih bisa dipulihkan (menu Backup → atau manual dari console).
  function backupLocal(scope) {
    try {
      var cur = localStorage.getItem(dbKey(scope));
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
    var hadData = !isEmpty(readLocal(scope));
    if (hadData) backupLocal(scope);
    return writeLocal(scope, val);
  }

  // Hash ringan (FNV-1a 32-bit) untuk deteksi perubahan isi
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16);
  }

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

  // --- KIRIM SATU SCOPE ---
  async function pushScope(scope) {
    var c = client();
    if (!c || !ready()) return { ok: false, reason: 'not-ready' };
    var payload = readLocal(scope);
    if (payload === null) return { ok: true, skipped: true };
    if (isEmpty(payload)) return { ok: true, skipped: true };

    var res = await c.dataSet(scope, payload, 0, deviceId());
    if (res && res.ok) {
      var meta = loadMeta();
      meta[scope] = {
        updated_at: res.updated_at || new Date().toISOString(),
        checksum: hash(JSON.stringify(payload)),
        size: res.size_bytes || 0
      };
      saveMeta(meta);
      return { ok: true };
    }
    return { ok: false, res: res };
  }

  function deviceId() {
    try { return localStorage.getItem('pkg_device_id') || ''; } catch (e) { return ''; }
  }

  // --- KIRIM SEMUA YANG TERTUNDA ---
  async function flush() {
    if (pushing) return;
    if (!ready()) return;
    var scopes = Object.keys(pending);
    if (!scopes.length) return;
    pushing = true;
    var failed = [];
    try {
      for (var i = 0; i < scopes.length; i++) {
        var s = scopes[i];
        var r = await pushScope(s);
        if (r && r.ok) {
          delete pending[s];
        } else {
          failed.push(s);
        }
      }
    } finally {
      pushing = false;
    }
    if (failed.length) {
      notify({ ok: false, message: 'Sebagian data belum terkirim (offline?)', pending: failed.length, at: Date.now() });
    } else if (scopes.length) {
      notify({ ok: true, message: 'Data tersimpan di server', at: Date.now() });
    }
  }

  function schedulePush(scope) {
    if (scope && SCOPES.indexOf(scope) === -1) return;
    if (!ready()) return;
    if (scope) pending[scope] = true; else for (var i = 0; i < SCOPES.length; i++) pending[SCOPES[i]] = true;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; flush(); }, PUSH_DELAY);
  }

  // --- TARIK DARI SERVER ---
  // Mengembalikan { ok, applied, uploaded, errors }
  async function pullAll() {
    var c = client();
    if (!c || !ready()) return { ok: false, reason: 'not-ready', applied: 0, uploaded: 0 };
    var res = await c.dataGet(null);
    if (!res || !res.ok) {
      return { ok: false, reason: (res && res.status) || 'error', applied: 0, uploaded: 0 };
    }
    var rows = res.rows || [];
    var byScope = {};
    for (var i = 0; i < rows.length; i++) byScope[rows[i].scope] = rows[i];

    var meta = loadMeta();
    var applied = 0, uploaded = 0, errors = [], conflicts = [];

    for (var j = 0; j < SCOPES.length; j++) {
      var scope = SCOPES[j];
      var local = readLocal(scope);
      var srv = byScope[scope];

      if (!srv) {
        // Server belum punya → unggah data lokal (migrasi otomatis)
        if (!isEmpty(local)) {
          var up = await pushScope(scope);
          if (up && up.ok && !up.skipped) uploaded++;
        }
        continue;
      }

      var localHash = isEmpty(local) ? '' : hash(JSON.stringify(local));
      var srvHash = srv.checksum || '';

      // Sama → tidak perlu apa-apa
      if (localHash && srvHash && localHash === srvHash) {
        meta[scope] = { updated_at: srv.updated_at, checksum: srvHash, size: srv.size_bytes || 0 };
        continue;
      }

      // Lokal kosong → ambil dari server
      if (!localHash) {
        if (writeLocalFromServer(scope, srv.payload)) {
          meta[scope] = { updated_at: srv.updated_at, checksum: srvHash, size: srv.size_bytes || 0 };
          applied++;
        } else errors.push(scope);
        continue;
      }

      // Keduanya ada tapi beda → pakai yang lebih baru
      var localAt = Date.parse((meta[scope] && meta[scope].updated_at) || 0);
      var srvAt = Date.parse(srv.updated_at || 0);
      if (!localAt || (srvAt && srvAt > localAt + 1000)) {
        // Server lebih baru (atau perangkat ini belum pernah sinkron scope ini)
        // → ambil server, tapi simpan dulu salinan lokal supaya tidak hilang.
        if (writeLocalFromServer(scope, srv.payload)) {
          meta[scope] = { updated_at: srv.updated_at, checksum: srvHash, size: srv.size_bytes || 0 };
          applied++;
          conflicts.push(scope);
        } else errors.push(scope);
      } else {
        // Lokal lebih baru → kirim lokal
        var up2 = await pushScope(scope);
        if (up2 && up2.ok && !up2.skipped) uploaded++;
      }
    }

    saveMeta(meta);
    if (applied || uploaded) {
      notify({
        ok: errors.length === 0,
        message: (applied ? applied + ' bagian diambil dari server' : '') +
                 (uploaded ? (applied ? ', ' : '') + uploaded + ' bagian diunggah' : ''),
        applied: applied, uploaded: uploaded, conflicts: conflicts, at: Date.now()
      });
    }
    return { ok: true, applied: applied, uploaded: uploaded, conflicts: conflicts, errors: errors };
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

  // Coba kirim sisa saat aplikasi ditutup / jaringan kembali
  window.addEventListener('online', function () { schedulePush(null); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
  });

  window.PKGSync = {
    SCOPES: SCOPES,
    ready: ready,
    pullAll: pullAll,
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
