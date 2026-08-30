// regression-test-ra.js — 8 skenario test untuk verifikasi integrasi RA
// Jalankan: node regression-test-ra.js
// Simulasi browser env (window, localStorage) tanpa DOM.

// --- Mock browser environment ---
var _storage = {};
global.window = {
  INSTRUMEN: [],
  INSTRUMEN_RA: [],
  PKG_RA_META: {},
};
global.localStorage = {
  getItem: function(k) { return k in _storage ? _storage[k] : null; },
  setItem: function(k, v) { _storage[k] = String(v); },
  removeItem: function(k) { delete _storage[k]; },
};
global.console = console;

// Load instrumen.js (original)
require('./instrumen.js');
// Load pkg-ra.js (RA dataset)
require('./pkg-ra.js');

// Now load db.js — but db.js references window, localStorage, etc.
// We need to eval it in this context
var fs = require('fs');
var dbCode = fs.readFileSync('./db.js', 'utf8');
eval(dbCode);

// --- Helpers ---
var PKGDB = window.PKGDB;
var pass = 0, fail = 0;
function test(name, fn) {
  try {
    fn();
    console.log('  ✅ ' + name);
    pass++;
  } catch (e) {
    console.log('  ❌ ' + name + ' — ' + e.message);
    fail++;
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }
function eq(a, b, msg) { if (a !== b) throw new Error((msg||'') + ' expected ' + b + ' got ' + a); }

// --- Reset storage for clean tests ---
_storage = {};

// --- Test data setup ---
// Setup a kamad with jenjang RA
PKGDB.saveKamad({ id: 1, nama_madrasah: 'RA Al-Hikmah', jenjang: 'RA', tahun_pelajaran: '2025/2026', alamat_madrasah: 'Jl. Test', kkm: 'KKM 01', kabupaten: 'Jember', nama_kamad: 'Budi', nip_kamad: '123', nama_penilai: 'Yanto', nip_penilai: '456', jabatan_penilai: 'Pengawas' });

// Setup a kamad with jenjang MI
PKGDB.saveKamad({ id: 2, nama_madrasah: 'MI Al-Falah', jenjang: 'MI', tahun_pelajaran: '2025/2026', alamat_madrasah: 'Jl. Test2', kkm: 'KKM 02', kabupaten: 'Jember', nama_kamad: 'Budi2', nip_kamad: '124', nama_penilai: 'Yanto', nip_penilai: '456', jabatan_penilai: 'Pengawas' });

// Setup guru RA
var guruRA = PKGDB.saveGuru({ nama: 'Siti RA', nip: '111', nama_madrasah: 'RA Al-Hikmah', jenjang: 'RA', role_code: 'GMP' });

// Setup guru MI
var guruMI = PKGDB.saveGuru({ nama: 'Ahmad MI', nip: '222', nama_madrasah: 'MI Al-Falah', jenjang: 'MI', role_code: 'GMP' });

// Setup guru tanpa jenjang (backward compat — data lama)
var guruOld = PKGDB.saveGuru({ nama: 'Old Teacher', nip: '333', nama_madrasah: 'MI Al-Falah', role_code: 'GMP' });

// === 8 REGRESSION TESTS ===

console.log('\n=== REGRESSION TEST: PKG RA Integration ===\n');

// Test 1: MI guru → getInstrumen returns legacy INSTRUMEN (bukan RA)
test('1. MI guru → instrumen legacy (bukan RA)', function() {
  var ins = PKGDB.getInstrumen('GMP', guruMI);
  var gmpLegacy = window.INSTRUMEN.filter(function(i) { return i.role_code === 'GMP'; });
  eq(ins.length, gmpLegacy.length, 'MI should get same count as legacy GMP');
  // Legacy IDs use format role_kompNo_indNo (e.g. GMP_1_1)
  assert(ins[0].id === 'GMP_1_1', 'Expected GMP_1_1, got ' + ins[0].id);
  // Should NOT have any RA- prefixed IDs
  var raIds = ins.filter(function(i) { return /^RA-/.test(i.id); });
  eq(raIds.length, 0, 'MI should have zero RA-prefixed IDs');
});

// Test 2: RA guru → getInstrumen returns INSTRUMEN_RA (79 items)
test('2. RA guru → instrumen RA (79 items)', function() {
  var ins = PKGDB.getInstrumen('GMP', guruRA);
  eq(ins.length, 79, 'RA instrumen count');
  // Verify IDs use RA namespace
  assert(/^RA-01-01$/.test(ins[0].id), 'First RA ID should be RA-01-01, got ' + ins[0].id);
  assert(/^RA-15-03$/.test(ins[78].id), 'Last RA ID should be RA-15-03, got ' + ins[78].id);
});

// Test 3: hitungNilai for RA guru uses RA instrument
test('3. hitungNilai RA guru → pakai instrumen RA', function() {
  // Create penilaian for RA guru
  var pen = PKGDB.getOrCreatePenilaian(guruRA.id, 'GMP', 'Formatif');
  // Score all 79 indicators with 2
  var ins = PKGDB.getInstrumen('GMP', guruRA);
  ins.forEach(function(it) { PKGDB.setSkor(pen.id, it.id, 2); });
  var n = PKGDB.hitungNilai(pen.id, 'GMP');
  eq(n.nilaiAkhir, 100, 'Expected nilai 100 for all-2, got ' + n.nilaiAkhir);
  eq(n.sebutan, 'Amat Baik', 'Expected Amat Baik, got ' + n.sebutan);
  eq(n.kompPct.length, 15, 'Expected 15 komponen, got ' + n.kompPct.length);
  // All kompPct should be 100
  n.kompPct.forEach(function(k) { eq(k.pct, 100, 'Komp ' + k.no + ' pct'); });
});

// Test 4: getOrCreatePenilaian for RA embeds metadata
test('4. getOrCreatePenilaian RA → metadata jenjang/instrumentType/version', function() {
  var pen = PKGDB.getOrCreatePenilaian(guruRA.id, 'GMP', 'Formatif');
  eq(pen.jenjang, 'RA', 'penilaian.jenjang');
  eq(pen.instrumentType, 'PKG_RA', 'penilaian.instrumentType');
  eq(pen.instrumentVersion, '2026.1', 'penilaian.instrumentVersion');
});

// Test 5: MI/MTs/MA guru → NO RA metadata
test('5. MI guru → TIDAK ada metadata RA', function() {
  var pen = PKGDB.getOrCreatePenilaian(guruMI.id, 'GMP', 'Formatif');
  assert(pen.jenjang !== 'RA', 'MI penilaian should NOT have jenjang RA');
  assert(pen.instrumentType !== 'PKG_RA', 'MI penilaian should NOT have instrumentType PKG_RA');
});

// Test 6: Backward compat — guru tanpa jenjang tetap pakai instrumen legacy
test('6. Guru tanpa jenjang (data lama) → instrumen legacy', function() {
  var ins = PKGDB.getInstrumen('GMP', guruOld);
  var gmpLegacy = window.INSTRUMEN.filter(function(i) { return i.role_code === 'GMP'; });
  eq(ins.length, gmpLegacy.length, 'Legacy GMP count');
  assert(ins[0].id === 'GMP_1_1', 'Legacy ID format');
  var pen = PKGDB.getOrCreatePenilaian(guruOld.id, 'GMP', 'Formatif');
  assert(pen.jenjang !== 'RA', 'Old data should not have RA metadata');
});

// Test 7: RA skor IDs tidak bentrok dengan legacy GMP IDs
test('7. RA skor IDs tidak bentrok dengan legacy', function() {
  var penRA = PKGDB.getOrCreatePenilaian(guruRA.id, 'GMP', 'Sumatif');
  var penMI = PKGDB.getOrCreatePenilaian(guruMI.id, 'GMP', 'Sumatif');
  var insRA = PKGDB.getInstrumen('GMP', guruRA);
  var insMI = PKGDB.getInstrumen('GMP', guruMI);
  // Set some scores
  PKGDB.setSkor(penRA.id, insRA[0].id, 2);
  PKGDB.setSkor(penMI.id, insMI[0].id, 1);
  // Verify RA skor only has RA IDs
  var skorRA = PKGDB.getSkorMap(penRA.id);
  var raKeys = Object.keys(skorRA);
  assert(raKeys.every(function(k) { return /^RA-/.test(k); }), 'RA skor keys should start with RA-');
  // Verify MI skor only has legacy IDs
  var skorMI = PKGDB.getSkorMap(penMI.id);
  var miKeys = Object.keys(skorMI);
  assert(miKeys.every(function(k) { return !/^RA-/.test(k); }), 'MI skor keys should NOT start with RA-');
});

// Test 8: guru undefined (getInstrumen tanpa konteks guru) → legacy
test('8. getInstrumen(role) tanpa guru → legacy (backward compat)', function() {
  var gmpLegacy = window.INSTRUMEN.filter(function(i) { return i.role_code === 'GMP'; });
  var ins = PKGDB.getInstrumen('GMP');
  eq(ins.length, gmpLegacy.length, 'Legacy GMP count');
  assert(ins[0].id === 'GMP_1_1', 'Legacy ID');
  // Also test with null/undefined
  var ins2 = PKGDB.getInstrumen('GMP', null);
  eq(ins2.length, gmpLegacy.length, 'Legacy count with null guru');
  var ins3 = PKGDB.getInstrumen('GMP', undefined);
  eq(ins3.length, gmpLegacy.length, 'Legacy count with undefined guru');
});

// --- Results ---
console.log('\n=== HASIL: ' + pass + ' passed, ' + fail + ' failed, ' + (pass+fail) + ' total ===');
if (fail > 0) {
  console.log('❌ TEST GAGAL — perbaiki sebelum commit');
  process.exit(1);
} else {
  console.log('✅ SEMUA TEST LULUS — siap commit & push');
  process.exit(0);
}
