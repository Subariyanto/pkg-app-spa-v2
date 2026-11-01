// Uji E2E sinkronisasi PKG: simulasi 2 perangkat dengan localStorage terpisah.
// Jalankan: node test-sync-e2e.mjs
import fs from 'node:fs';
import vm from 'node:vm';

const BASE = 'https://api.pokjawasjember.com/functions/v1/pkg-api';
const USER = 'zz_uji_sync';
const PASS = 'uji12345';

function makeDevice(name) {
  const store = new Map();
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
  const listeners = {};
  const windowObj = {
    localStorage,
    addEventListener: (t, f) => { (listeners[t] ||= []).push(f); },
    dispatchEvent: (ev) => { (listeners[ev.type] || []).forEach((f) => f(ev)); return true; },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
  };
  const documentObj = {
    addEventListener: () => {},
    visibilityState: 'visible',
  };
  const ctx = {
    window: windowObj,
    document: documentObj,
    localStorage,
    fetch: (...a) => fetch(...a),
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    Promise, JSON, Date, Math, Uint8Array, TextEncoder, TextDecoder, atob, btoa, Array, Object, String, Number,
    navigator: { userAgent: `test-${name}` },
    CustomEvent: windowObj.CustomEvent,
  };
  ctx.window.window = ctx.window;
  ctx.globalThis = ctx;
  windowObj.navigator = ctx.navigator;
  return { ctx, store, name };
}

function loadInto(dev, files) {
  const context = vm.createContext(dev.ctx);
  for (const f of files) {
    const code = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
    vm.runInContext(code, context, { filename: f });
  }
  return dev.ctx;
}

// Bandingkan isi, bukan urutan key (Postgres jsonb menormalkan urutan key)
const canon = (v) => Array.isArray(v)
  ? '[' + v.map(canon).join(',') + ']'
  : (v && typeof v === 'object')
    ? '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}'
    : JSON.stringify(v);

const ok = (c, m) => console.log(`${c ? 'PASS' : 'FAIL'} — ${m}`);
let failures = 0;
const check = (c, m) => { if (!c) failures++; ok(c, m); };

// ---------- Perangkat A: pengguna lama dengan data lokal ----------
const A = makeDevice('A');
loadInto(A, ['./cloudflare_sync.js', './pkg-sync.js']);

const guruA = [{ id: 1, nama: 'Ahmad Fauzi', nip: '198001012005011001', nama_madrasah: 'MTs Uji' }];
const penA = [{ id: 1, guru_id: 1, role_code: 'GURU_KELAS', jenis: 'utama', tanggal: '2026-11-01', periode: 2026 }];
const skorA = [{ id: 1, penilaian_id: 1, indikator_id: 'I1', skor: 4 }];

A.store.set('pkg_v1_guru', JSON.stringify(guruA));
A.store.set('pkg_v1_penilaian', JSON.stringify(penA));
A.store.set('pkg_v1_skor', JSON.stringify(skorA));
A.store.set('pkg_v1_periode_active', JSON.stringify(2026));

// login perangkat A
const loginA = await A.ctx.window.SupabaseSync.loginAccount(USER, PASS, 'DEV-A', 'ua-A');
check(loginA.ok === true, 'A: login berhasil');
check(typeof loginA.token === 'string' && loginA.token.length > 40, 'A: dapat token sesi akun');
check(A.ctx.window.SupabaseSync.hasAccountToken() === true, 'A: token tersimpan di perangkat');

// unggah (server kemungkinan masih kosong -> migrasi otomatis)
const pullA = await A.ctx.window.PKGSync.pullAll();
check(pullA.ok === true, `A: pullAll jalan (uploaded=${pullA.uploaded}, applied=${pullA.applied})`);
check(pullA.uploaded >= 3, 'A: data lokal terunggah ke server (>=3 scope)');

const listA = await A.ctx.window.SupabaseSync.dataList();
check(listA.ok && listA.rows.length >= 3, `A: server menyimpan ${listA.rows?.length} scope`);

// ---------- Perangkat B: perangkat baru, kosong ----------
const B = makeDevice('B');
loadInto(B, ['./cloudflare_sync.js', './pkg-sync.js']);

const loginB = await B.ctx.window.SupabaseSync.loginAccount(USER, PASS, 'DEV-B', 'ua-B');
check(loginB.ok === true, 'B: login dengan akun sama berhasil');

const pullB = await B.ctx.window.PKGSync.pullAll();
check(pullB.ok === true, `B: pullAll jalan (applied=${pullB.applied})`);
check(pullB.applied >= 3, 'B: data ditarik dari server (>=3 scope)');

const guruB = JSON.parse(B.store.get('pkg_v1_guru'));
const penilB = JSON.parse(B.store.get('pkg_v1_penilaian'));
const skorB = JSON.parse(B.store.get('pkg_v1_skor'));
check(canon(guruB) === canon(guruA), 'B: data guru identik dengan A');
check(canon(penilB) === canon(penA), 'B: data penilaian identik dengan A');
check(canon(skorB) === canon(skorA), 'B: data skor identik dengan A');
check(JSON.parse(B.store.get('pkg_v1_periode_active')) === 2026, 'B: periode aktif ikut pindah');

// ---------- B mengubah data -> A harus menerima ----------
const guruB2 = [...guruB, { id: 2, nama: 'Siti Aminah', nip: '198502022010012002', nama_madrasah: 'MTs Uji' }];
B.store.set('pkg_v1_guru', JSON.stringify(guruB2));
const pushB = await B.ctx.window.PKGSync.pushScope('guru');
check(pushB.ok === true, 'B: perubahan guru terkirim');

const pullA2 = await A.ctx.window.PKGSync.pullAll();
const guruA2 = JSON.parse(A.store.get('pkg_v1_guru'));
check(guruA2.length === 2, `A: menerima tambahan guru dari B (jumlah=${guruA2.length})`);
check(guruA2.some((g) => g.nama === 'Siti Aminah'), 'A: guru baru dari B muncul');

// ---------- Uji tanpa token (perangkat logout) ----------
const C = makeDevice('C');
loadInto(C, ['./cloudflare_sync.js', './pkg-sync.js']);
const pullC = await C.ctx.window.PKGSync.pullAll();
check(pullC.ok === false && pullC.reason === 'not-ready', 'C: tanpa login tidak menarik data (aman)');

const raw = await C.ctx.window.SupabaseSync.dataGet(null);
check(raw.ok === false, 'C: panggilan data tanpa token ditolak');

// ---------- Bersihkan data uji ----------
for (const s of ['guru', 'penilaian', 'skor', 'periode_active']) {
  await A.ctx.window.SupabaseSync.dataDel(s, 0);
}
const afterDel = await A.ctx.window.SupabaseSync.dataList();
check((afterDel.rows || []).length === 0, 'Pembersihan: data uji terhapus dari server');

console.log(failures === 0 ? '\nSEMUA UJI LULUS' : `\n${failures} UJI GAGAL`);
process.exit(failures === 0 ? 0 : 1);
