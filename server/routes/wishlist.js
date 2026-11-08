const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth } = require('../auth');

// All wishlist routes require authentication
router.use(requireAuth);

// GET user wishlist items
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;

    const items = db.prepare(`
      SELECT w.id as wishlist_id, w.created_at as wishlisted_at,
             p.*, c.name as collection_name, c.slug as collection_slug
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      JOIN collections c ON p.collection_id = c.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(userId);

    const getVariants = db.prepare(`
      SELECT id, size, color, color_code, stock, reserved_stock,
             MAX(0, stock - reserved_stock) as available_stock
      FROM product_variants
      WHERE product_id = ?
    `);

    const formattedItems = items.map(product => {
      const variants = getVariants.all(product.id);
      const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
      const isSoldOut = totalStock <= 0 || variants.every(v => v.stock <= 0);

      let images = [];
      try {
        images = JSON.parse(product.images);
      } catch (e) {
        images = [product.images];
      }

      return {
        ...product,
        images,
        primary_image: images[0] || '',
        variants,
        total_stock: totalStock,
        is_sold_out: isSoldOut,
        is_wishlisted: true
      };
    });

    res.json({
      success: true,
      wishlist: formattedItems
    });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat wishlist.' });
  }
});

// TOGGLE Wishlist (Add or Remove)
router.post('/toggle', (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID diperlukan.' });
    }

    const existing = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?').get(userId, productId);

    if (existing) {
      // Remove
      db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
      return res.json({
        success: true,
        action: 'removed',
        message: 'Produk dihapus dari Wishlist.',
        is_wishlisted: false
      });
    } else {
      // Add
      db.prepare('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)').run(userId, productId);
      return res.json({
        success: true,
        action: 'added',
        message: 'Produk ditambahkan ke Wishlist.',
        is_wishlisted: true
      });
    }
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui wishlist.' });
  }
});

// REMOVE single item from wishlist
router.delete('/:productId', (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(userId, productId);

    res.json({
      success: true,
      message: 'Produk berhasil dihapus dari wishlist.'
    });
  } catch (err) {
    console.error('Delete wishlist item error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus dari wishlist.' });
  }
});

module.exports = router;
