const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { optionalAuth } = require('../auth');

router.use(optionalAuth);

// Helper to get cart query condition
function getCartFilter(req) {
  if (req.user) {
    return { condition: 'user_id = ?', param: req.user.id };
  }
  const sessionId = req.headers['x-session-id'] || 'anonymous-session';
  return { condition: 'session_id = ? AND user_id IS NULL', param: sessionId };
}

// GET cart items with live stock validation
router.get('/', (req, res) => {
  try {
    const filter = getCartFilter(req);

    const items = db.prepare(`
      SELECT ci.id as cart_item_id, ci.quantity, ci.variant_id,
             v.size, v.color, v.color_code, v.stock, v.reserved_stock,
             MAX(0, v.stock - v.reserved_stock) as available_stock,
             p.id as product_id, p.name as product_name, p.slug as product_slug,
             p.price, p.images
      FROM cart_items ci
      JOIN product_variants v ON ci.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE ci.${filter.condition}
      ORDER BY ci.created_at DESC
    `).all(filter.param);

    let subtotal = 0;
    const formattedItems = items.map(item => {
      let images = [];
      try {
        images = JSON.parse(item.images);
      } catch (e) {
        images = [item.images];
      }

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const isOutOfStock = item.available_stock <= 0;
      const isExceedingStock = item.quantity > item.available_stock;

      return {
        id: item.cart_item_id,
        variant_id: item.variant_id,
        product_id: item.product_id,
        name: item.product_name,
        slug: item.product_slug,
        size: item.size,
        color: item.color,
        color_code: item.color_code,
        price: item.price,
        quantity: item.quantity,
        subtotal: itemTotal,
        image: images[0] || '',
        stock: item.stock,
        available_stock: item.available_stock,
        is_out_of_stock: isOutOfStock,
        is_exceeding_stock: isExceedingStock
      };
    });

    const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 20000;
    const total = subtotal + shippingFee;

    res.json({
      success: true,
      items: formattedItems,
      subtotal,
      shippingFee,
      total,
      itemCount: formattedItems.reduce((acc, i) => acc + i.quantity, 0)
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat keranjang.' });
  }
});

// ADD to cart
router.post('/add', (req, res) => {
  try {
    const { variantId, quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10));

    if (!variantId) {
      return res.status(400).json({ success: false, message: 'Varian ukuran & warna harus dipilih.' });
    }

    // Check variant stock
    const variant = db.prepare(`
      SELECT v.*, MAX(0, v.stock - v.reserved_stock) as available_stock, p.name as product_name
      FROM product_variants v
      JOIN products p ON v.product_id = p.id
      WHERE v.id = ?
    `).get(variantId);

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Varian produk tidak ditemukan.' });
    }

    if (variant.available_stock <= 0) {
      return res.status(400).json({ success: false, message: `Maaf, stok untuk ukuran ${variant.size} habis.` });
    }

    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'anonymous-session';

    // Check if variant already in cart
    let existing;
    if (userId) {
      existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND variant_id = ?').get(userId, variantId);
    } else {
      existing = db.prepare('SELECT id, quantity FROM cart_items WHERE session_id = ? AND variant_id = ? AND user_id IS NULL').get(sessionId, variantId);
    }

    const newQty = existing ? existing.quantity + qty : qty;

    if (newQty > variant.available_stock) {
      return res.status(400).json({
        success: false,
        message: `Stok tidak mencukupi. Sisa stok tersedia: ${variant.available_stock} pcs.`
      });
    }

    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
    } else {
      db.prepare(`
        INSERT INTO cart_items (user_id, session_id, variant_id, quantity)
        VALUES (?, ?, ?, ?)
      `).run(userId, sessionId, variantId, newQty);
    }

    res.json({
      success: true,
      message: `${variant.product_name} (${variant.size}) berhasil ditambahkan ke keranjang!`
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan ke keranjang.' });
  }
});

// UPDATE quantity (+/-)
router.put('/update', (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (!cartItemId || isNaN(qty)) {
      return res.status(400).json({ success: false, message: 'Parameter tidak valid.' });
    }

    if (qty <= 0) {
      // Remove item
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);
      return res.json({ success: true, message: 'Item dihapus dari keranjang.' });
    }

    // Check stock limit
    const item = db.prepare(`
      SELECT ci.id, ci.variant_id, MAX(0, v.stock - v.reserved_stock) as available_stock
      FROM cart_items ci
      JOIN product_variants v ON ci.variant_id = v.id
      WHERE ci.id = ?
    `).get(cartItemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item keranjang tidak ditemukan.' });
    }

    if (qty > item.available_stock) {
      return res.status(400).json({
        success: false,
        message: `Jumlah melebihi stok yang tersedia (${item.available_stock} pcs).`
      });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(qty, cartItemId);

    res.json({ success: true, message: 'Jumlah berhasil diperbarui.' });
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui item.' });
  }
});

// DELETE cart item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);

    res.json({ success: true, message: 'Item dihapus dari keranjang.' });
  } catch (err) {
    console.error('Delete cart item error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus item.' });
  }
});

// SYNC guest cart to user on login
router.post('/sync', (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Login diperlukan.' });
    }

    const sessionId = req.headers['x-session-id'];
    if (sessionId) {
      // Move guest items to user
      const guestItems = db.prepare('SELECT * FROM cart_items WHERE session_id = ? AND user_id IS NULL').all(sessionId);

      for (const item of guestItems) {
        const userExisting = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND variant_id = ?')
          .get(req.user.id, item.variant_id);

        if (userExisting) {
          db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(item.quantity, userExisting.id);
          db.prepare('DELETE FROM cart_items WHERE id = ?').run(item.id);
        } else {
          db.prepare('UPDATE cart_items SET user_id = ?, session_id = NULL WHERE id = ?').run(req.user.id, item.id);
        }
      }
    }

    res.json({ success: true, message: 'Keranjang berhasil disinkronkan.' });
  } catch (err) {
    console.error('Sync cart error:', err);
    res.status(500).json({ success: false, message: 'Gagal sinkronisasi keranjang.' });
  }
});

module.exports = router;
