const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'npd_club_secret_streetwear_2026';

// Middleware to authenticate JWT
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Sesi telah berakhir. Silakan login kembali.' });
  }
}

// Optional Auth (for cart/guest)
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // ignore
    }
  }
  next();
}

// REGISTER
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    // Check existing email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, phone, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), email.toLowerCase().trim(), phone || '', passwordHash);

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || ''
    };

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Selamat datang di NPD CLUB.',
      user,
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat registrasi.' });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const userRecord = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!userRecord) {
      return res.status(400).json({ success: false, message: 'Email atau password tidak sesuai.' });
    }

    const isMatch = bcrypt.compareSync(password, userRecord.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email atau password tidak sesuai.' });
    }

    const user = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone
    };

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login berhasil.',
      user,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat login.' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi.' });
    }

    const user = db.prepare('SELECT id, name FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      // Don't leak if email exists or not, but return friendly note
      return res.json({
        success: true,
        message: 'Jika email terdaftar, tautan reset password telah dikirim ke kotak masuk Anda.'
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?')
      .run(resetToken, expiry, user.id);

    res.json({
      success: true,
      message: 'Tautan reset password telah dibuat.',
      resetToken, // Included so user/tester can reset right in the interface!
      demoNote: 'Dalam mode demo/development, token reset Anda adalah: ' + resetToken
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// RESET PASSWORD
router.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token dan password baru wajib diisi.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    const user = db.prepare(`
      SELECT id FROM users
      WHERE reset_token = ? AND datetime(reset_token_expiry) > datetime('now')
    `).get(token);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token reset tidak valid atau telah kedaluwarsa.' });
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    db.prepare(`
      UPDATE users
      SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL
      WHERE id = ?
    `).run(passwordHash, user.id);

    res.json({
      success: true,
      message: 'Password berhasil diperbarui. Silakan login dengan password baru.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', requireAuth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?').get(user.id).count;
    const wishlistCount = db.prepare('SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?').get(user.id).count;

    res.json({
      success: true,
      user: {
        ...user,
        orderCount,
        wishlistCount
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat profil user.' });
  }
});

// UPDATE PROFILE
router.put('/profile', requireAuth, (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama tidak boleh kosong.' });
    }

    db.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?').run(name.trim(), phone || '', req.user.id);

    const updated = db.prepare('SELECT id, name, email, phone FROM users WHERE id = ?').get(req.user.id);
    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      user: updated
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
});

module.exports = {
  router,
  requireAuth,
  optionalAuth
};
