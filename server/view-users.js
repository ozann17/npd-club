const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'npd_club.sqlite');
const db = new Database(dbPath);

console.log('========================================================================');
console.log('✦ DAFTAR PENGGUNA TERDAFTAR (DATABASE TABEL USERS) - NPD CLUB ✦');
console.log('========================================================================\n');

try {
  const users = db.prepare(`
    SELECT id, name, email, phone, created_at,
           SUBSTR(password_hash, 1, 25) || '...' AS password_hash_bcrypt
    FROM users
    ORDER BY id ASC
  `).all();

  if (users.length === 0) {
    console.log('Belum ada pengguna terdaftar.');
  } else {
    console.table(users);
    console.log(`\nTotal Pengguna: ${users.length} akun`);
    console.log('Catatan: Password sengaja dienkripsi menggunakan Bcrypt Hash demi keamanan data pengguna.\n');
  }
} catch (err) {
  console.error('Gagal membaca database users:', err.message);
}
