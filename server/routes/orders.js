const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth } = require('../auth');

// All order actions require authentication
router.use(requireAuth);

// Helper to generate unique order number: NPD-YYYYMMDD-XXXX
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NPD-${dateStr}-${rand}`;
}

// CREATE ORDER & RESERVE STOCK
router.post('/checkout', (req, res) => {
  const userId = req.user.id;
  const {
    shippingName,
    shippingPhone,
    shippingAddress,
    shippingCity,
    shippingPostalCode,
    paymentMethod // 'qris', 'bca_va', 'bri_va', 'mandiri_va', 'bni_va'
  } = req.body;

  // Validation
  if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingPostalCode) {
    return res.status(400).json({ success: false, message: 'Harap lengkapi semua data alamat pengiriman.' });
  }

  const validMethods = ['qris', 'bca_va', 'bri_va', 'mandiri_va', 'bni_va'];
  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: 'Pilih metode pembayaran yang valid.' });
  }

  try {
    // 1. Get cart items
    const cartItems = db.prepare(`
      SELECT ci.id as cart_item_id, ci.quantity, ci.variant_id,
             v.size, v.color, v.stock, v.reserved_stock,
             MAX(0, v.stock - v.reserved_stock) as available_stock,
             p.id as product_id, p.name as product_name, p.price, p.images
      FROM cart_items ci
      JOIN product_variants v ON ci.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE ci.user_id = ?
    `).all(userId);

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja Anda masih kosong.' });
    }

    // 2. Strict Stock Validation: Check if any item is out of stock
    const outOfStockItems = [];
    for (const item of cartItems) {
      if (item.available_stock < item.quantity) {
        outOfStockItems.push({
          cart_item_id: item.cart_item_id,
          name: item.product_name,
          size: item.size,
          color: item.color,
          requested: item.quantity,
          available: item.available_stock
        });
      }
    }

    if (outOfStockItems.length > 0) {
      // Remove or report out-of-stock items
      const deleteStmt = db.prepare('DELETE FROM cart_items WHERE id = ?');
      const itemNames = outOfStockItems.map(i => `${i.name} (${i.size})`).join(', ');

      for (const item of outOfStockItems) {
        if (item.available <= 0) {
          deleteStmt.run(item.cart_item_id);
        }
      }

      return res.status(409).json({
        success: false,
        stock_error: true,
        message: `Maaf, stok untuk item berikut telah habis atau tidak mencukupi: ${itemNames}. Keranjang telah disesuaikan.`,
        outOfStockItems
      });
    }

    // 3. Calculate totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 500000 ? 0 : 20000;
    const totalAmount = subtotal + shippingFee;

    const orderNumber = generateOrderNumber();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Generate payment details
    let paymentDetails = {};
    if (paymentMethod === 'qris') {
      paymentDetails = {
        type: 'qris',
        qr_string: `00020101021226670016ID.CO.MIDTRANS.WWW011893600002011111111102150000${Date.now()}520458145303360540${totalAmount}5802ID5908NPD CLUB6007JAKARTA62190115${orderNumber}6304ABCD`,
        expires_at: expiresAt
      };
    } else {
      const bank = paymentMethod.split('_')[0].toUpperCase();
      let vaPrefix = '10777';
      if (bank === 'BRI') vaPrefix = '88888';
      if (bank === 'MANDIRI') vaPrefix = '89999';
      if (bank === 'BNI') vaPrefix = '98888';

      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const vaNumber = `${vaPrefix}${randomSuffix}`;

      paymentDetails = {
        type: 'virtual_account',
        bank,
        va_number: vaNumber,
        expires_at: expiresAt
      };
    }

    // 4. Database Transaction: Reserve stock, create order, insert items, clear cart
    const createOrderTx = db.transaction(() => {
      // Reserve stock for each variant
      const reserveStockStmt = db.prepare(`
        UPDATE product_variants
        SET reserved_stock = reserved_stock + ?
        WHERE id = ?
      `);

      for (const item of cartItems) {
        reserveStockStmt.run(item.quantity, item.variant_id);
      }

      // Insert Order
      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (
          order_number, user_id, shipping_name, shipping_phone,
          shipping_address, shipping_city, shipping_postal_code,
          payment_method, payment_details, subtotal, shipping_fee,
          total_amount, status, expires_at
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, 'pending', ?
        )
      `);

      const orderResult = insertOrderStmt.run(
        orderNumber, userId, shippingName.trim(), shippingPhone.trim(),
        shippingAddress.trim(), shippingCity.trim(), shippingPostalCode.trim(),
        paymentMethod, JSON.stringify(paymentDetails), subtotal, shippingFee,
        totalAmount, expiresAt
      );

      const orderId = orderResult.lastInsertRowid;

      // Insert Order Items
      const insertOrderItemStmt = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, variant_id, product_name,
          size, color, price, quantity, subtotal, image
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )
      `);

      for (const item of cartItems) {
        let firstImg = '';
        try {
          const imgs = JSON.parse(item.images);
          firstImg = imgs[0] || '';
        } catch (e) {
          firstImg = item.images;
        }

        insertOrderItemStmt.run(
          orderId, item.product_id, item.variant_id, item.product_name,
          item.size, item.color, item.price, item.quantity,
          item.price * item.quantity, firstImg
        );
      }

      // Clear user cart
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

      return { orderId, orderNumber };
    });

    const result = createOrderTx();

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat. Silakan selesaikan pembayaran.',
      order: {
        id: result.orderId,
        orderNumber: result.orderNumber,
        totalAmount,
        paymentMethod,
        paymentDetails,
        expiresAt
      }
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses pesanan: ' + err.message });
  }
});

// GET USER ORDERS LIST
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;

    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId);

    const getItems = db.prepare(`
      SELECT * FROM order_items
      WHERE order_id = ?
    `);

    const formatted = orders.map(order => {
      let paymentDetails = {};
      try {
        paymentDetails = JSON.parse(order.payment_details);
      } catch (e) {
        paymentDetails = {};
      }

      const items = getItems.all(order.id);

      return {
        ...order,
        payment_details: paymentDetails,
        items
      };
    });

    res.json({ success: true, orders: formatted });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat riwayat pesanan.' });
  }
});

// GET SINGLE ORDER DETAIL
router.get('/:orderNumber', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;

    const order = db.prepare(`
      SELECT * FROM orders
      WHERE order_number = ? AND user_id = ?
    `).get(orderNumber, userId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    let paymentDetails = {};
    try {
      paymentDetails = JSON.parse(order.payment_details);
    } catch (e) {
      paymentDetails = {};
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    res.json({
      success: true,
      order: {
        ...order,
        payment_details: paymentDetails,
        items
      }
    });
  } catch (err) {
    console.error('Get order detail error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail pesanan.' });
  }
});

// CANCEL PENDING ORDER (Releases reserved stock)
router.post('/:orderNumber/cancel', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;

    const order = db.prepare(`
      SELECT * FROM orders
      WHERE order_number = ? AND user_id = ?
    `).get(orderNumber, userId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Hanya pesanan pending yang dapat dibatalkan.' });
    }

    const items = db.prepare('SELECT variant_id, quantity FROM order_items WHERE order_id = ?').all(order.id);

    const cancelTx = db.transaction(() => {
      // Release reserved stock
      const releaseStmt = db.prepare(`
        UPDATE product_variants
        SET reserved_stock = MAX(0, reserved_stock - ?)
        WHERE id = ?
      `);

      for (const item of items) {
        releaseStmt.run(item.quantity, item.variant_id);
      }

      db.prepare(`UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(order.id);
    });

    cancelTx();

    res.json({ success: true, message: 'Pesanan berhasil dibatalkan dan stok dikembalikan.' });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ success: false, message: 'Gagal membatalkan pesanan.' });
  }
});

module.exports = router;
