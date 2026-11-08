const { db, initDb } = require('./db');

console.log('✦ Memperbarui data katalog & foto NPD CLUB...');

try {
  // Drop and re-initialize
  db.exec(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS wishlists;
    DROP TABLE IF EXISTS product_variants;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS collections;
    DROP TABLE IF EXISTS users;
  `);

  initDb();
  console.log('✅ Selesai! Seluruh foto dan data produk terbaru berhasil diperbarui ke database.');
} catch (err) {
  console.error('Error saat memperbarui database:', err);
}
