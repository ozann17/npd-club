const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { optionalAuth } = require('../auth');

// GET all collections
router.get('/collections', (req, res) => {
  try {
    const collections = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM collections c
      LEFT JOIN products p ON p.collection_id = c.id
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all();

    res.json({ success: true, collections });
  } catch (err) {
    console.error('Get collections error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat collections.' });
  }
});

// GET products by collection (or all products)
// Optional query: collection_slug (npd-collection, spring-collection, winter-collection)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { collection } = req.query;
    const userId = req.user ? req.user.id : null;

    let query = `
      SELECT p.*, c.name as collection_name, c.slug as collection_slug
      FROM products p
      JOIN collections c ON p.collection_id = c.id
    `;
    const params = [];

    if (collection && collection !== 'all') {
      query += ` WHERE c.slug = ?`;
      params.push(collection);
    }

    query += ` ORDER BY p.id ASC`;

    const products = db.prepare(query).all(...params);

    // Fetch variants and wishlist status for each product
    const getVariants = db.prepare(`
      SELECT id, size, color, color_code, stock, reserved_stock,
             MAX(0, stock - reserved_stock) as available_stock
      FROM product_variants
      WHERE product_id = ?
    `);

    const checkWishlist = userId ? db.prepare(`
      SELECT 1 FROM wishlists WHERE user_id = ? AND product_id = ?
    `) : null;

    const formattedProducts = products.map(product => {
      const variants = getVariants.all(product.id);
      
      // Calculate total available stock
      const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
      const totalAvailableStock = variants.reduce((acc, v) => acc + (v.available_stock || 0), 0);
      
      // If ALL variants have stock 0 (or total stock <= 0), product is Sold Out
      const isSoldOut = totalStock <= 0 || variants.every(v => v.stock <= 0);

      let images = [];
      try {
        images = JSON.parse(product.images);
      } catch (e) {
        images = [product.images];
      }

      const isWishlisted = checkWishlist ? !!checkWishlist.get(userId, product.id) : false;

      // Extract unique sizes and colors
      const sizes = [...new Set(variants.map(v => v.size))];
      const colors = [...new Map(variants.map(v => [v.color, { name: v.color, code: v.color_code }])).values()];

      return {
        ...product,
        images,
        primary_image: images[0] || '',
        variants,
        sizes,
        colors,
        total_stock: totalStock,
        total_available_stock: totalAvailableStock,
        is_sold_out: isSoldOut,
        is_wishlisted: isWishlisted
      };
    });

    res.json({ success: true, products: formattedProducts });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat produk.' });
  }
});

// GET single product detail by slug or id
router.get('/:slugOrId', optionalAuth, (req, res) => {
  try {
    const { slugOrId } = req.params;
    const userId = req.user ? req.user.id : null;

    let product;
    if (isNaN(slugOrId)) {
      product = db.prepare(`
        SELECT p.*, c.name as collection_name, c.slug as collection_slug
        FROM products p
        JOIN collections c ON p.collection_id = c.id
        WHERE p.slug = ?
      `).get(slugOrId);
    } else {
      product = db.prepare(`
        SELECT p.*, c.name as collection_name, c.slug as collection_slug
        FROM products p
        JOIN collections c ON p.collection_id = c.id
        WHERE p.id = ?
      `).get(slugOrId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    const variants = db.prepare(`
      SELECT id, size, color, color_code, stock, reserved_stock,
             MAX(0, stock - reserved_stock) as available_stock
      FROM product_variants
      WHERE product_id = ?
    `).all(product.id);

    const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    const totalAvailableStock = variants.reduce((acc, v) => acc + (v.available_stock || 0), 0);
    const isSoldOut = totalStock <= 0 || variants.every(v => v.stock <= 0);

    let images = [];
    try {
      images = JSON.parse(product.images);
    } catch (e) {
      images = [product.images];
    }

    const isWishlisted = userId ? !!db.prepare(`
      SELECT 1 FROM wishlists WHERE user_id = ? AND product_id = ?
    `).get(userId, product.id) : false;

    // Group variant stock by size & color
    const sizes = [...new Set(variants.map(v => v.size))];
    const colors = [...new Map(variants.map(v => [v.color, { name: v.color, code: v.color_code }])).values()];

    res.json({
      success: true,
      product: {
        ...product,
        images,
        variants,
        sizes,
        colors,
        total_stock: totalStock,
        total_available_stock: totalAvailableStock,
        is_sold_out: isSoldOut,
        is_wishlisted: isWishlisted
      }
    });
  } catch (err) {
    console.error('Get product detail error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail produk.' });
  }
});

module.exports = router;
