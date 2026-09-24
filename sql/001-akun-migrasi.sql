-- ============================================================
-- MIGRASI: 1 kode aktivasi = 1 AKUN (bukan 1 perangkat)
-- Jalankan di Cloudflare Dashboard > D1 > pkg-backend > Console
-- Aman dijalankan berulang (IF NOT EXISTS).
-- ============================================================

-- 1. Tabel AKUN (1 kode aktivasi = 1 akun, username unik)
CREATE TABLE IF NOT EXISTS pkg_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,            -- kode aktivasi yang dipakai (1:1)
  username TEXT UNIQUE NOT NULL,        -- username login (unik, lowercase)
  password_hash TEXT NOT NULL,          -- sha256(salt + ':' + password)
  password_salt TEXT NOT NULL,
  nama TEXT,                            -- nama lengkap pemilik akun
  madrasah TEXT,                        -- DIKUNCI: tidak bisa diubah user
  kabupaten TEXT,                       -- DIKUNCI: tidak bisa diubah user
  role TEXT,                            -- pengawas | kamad | ...
  revoked INTEGER DEFAULT 0,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- 2. Tabel LOG PERANGKAT (bisa banyak perangkat per akun — hanya log)
CREATE TABLE IF NOT EXISTS pkg_account_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  device_id TEXT NOT NULL,
  user_agent TEXT,
  first_seen TEXT DEFAULT (datetime('now')),
  last_seen TEXT,
  UNIQUE(account_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_username ON pkg_accounts(username);
CREATE INDEX IF NOT EXISTS idx_accounts_code ON pkg_accounts(code);
CREATE INDEX IF NOT EXISTS idx_devices_account ON pkg_account_devices(account_id);

-- 3. Cek hasil
SELECT id, code, username, nama, madrasah, kabupaten, role, revoked, created_at FROM pkg_accounts;
