const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { db } = require('../db');

// Payment instructions for Virtual Accounts
const VA_INSTRUCTIONS = {
  BCA: {
    atm: [
      'Masukkan Kartu ATM BCA & PIN Anda.',
      'Pilih menu Transaksi Lainnya > Transfer > Ke Rekening BCA Virtual Account.',
      'Masukkan nomor BCA Virtual Account Anda dan tekan Benar.',
      'Periksa informasi yang tertera di layar (Nama: NPD CLUB, Jumlah Tagihan). Jika sesuai, tekan YA.',
      'Simpan bukti transaksi Anda.'
    ],
    mBanking: [
      'Buka aplikasi BCA Mobile (m-BCA) dan masukkan kode akses.',
      'Pilih menu m-Transfer > BCA Virtual Account.',
      'Masukkan nomor BCA Virtual Account atau pilih dari daftar transfer.',
      'Pastikan nama pemilik NPD CLUB dan total tagihan sesuai.',
      'Masukkan PIN m-BCA Anda. Transaksi selesai secara instan.'
    ],
    iBanking: [
      'Login ke KlikBCA Individual (https://ibank.klikbca.com).',
      'Pilih menu Transfer Dana > Transfer ke BCA Virtual Account.',
      'Masukkan nomor BCA Virtual Account.',
      'Kirim respon KeyBCA Appli 1 dan klik Kirim.'
    ]
  },
  BRI: {
    atm: [
      'Masukkan kartu ATM BRI dan PIN.',
      'Pilih menu Transaksi Lain > Pembayaran > Lain-lain > BRIVA.',
      'Masukkan nomor BRIVA Anda.',
      'Konfirmasi detail tagihan NPD CLUB lalu tekan Ya.',
      'Simpan struk transaksi sebagai bukti.'
    ],
    mBanking: [
      'Buka aplikasi BRImo dan login.',
      'Pilih menu Tagihan > BRIVA.',
      'Masukkan nomor BRIVA.',
      'Konfirmasi nominal dan masukkan PIN BRImo Anda.'
    ],
    iBanking: [
      'Login ke Internet Banking BRI.',
      'Pilih menu Pembayaran > BRIVA.',
      'Masukkan nomor BRIVA dan validasi dengan token m-Token.'
    ]
  },
  MANDIRI: {
    atm: [
      'Masukkan kartu ATM Mandiri dan PIN.',
      'Pilih menu Bayar/Beli > Multipayment.',
      'Masukkan kode perusahaan / nomor Mandiri Virtual Account.',
      'Periksa nominal dan nama NPD CLUB, lalu tekan Benar.'
    ],
    mBanking: [
      'Login ke Livin by Mandiri.',
      'Pilih menu Bayar > Buat Pembayaran Baru > Multipayment.',
      'Pilih penyedia jasa atau masukkan kode VA.',
      'Konfirmasi detail pembayaran dan masukkan PIN Livin.'
    ],
    iBanking: [
      'Login ke Mandiri Online.',
      'Pilih menu Bayar > Multipayment.',
      'Pilih rekening sumber dan masukkan nomor VA.'
    ]
  },
  BNI: {
    atm: [
      'Masukkan kartu ATM BNI dan PIN.',
      'Pilih menu Menu Lain > Pembayaran > Menu Berikutnya > Virtual Account Billing.',
      'Masukkan nomor BNI Virtual Account.',
      'Tagihan akan muncul, pilih Ya untuk membayar.'
    ],
    mBanking: [
      'Buka aplikasi BNI Mobile Banking.',
      'Pilih menu Transfer > Virtual Account Billing.',
      'Input nomor BNI Virtual Account.',
      'Masukkan password transaksi Anda.'
    ],
    iBanking: [
      'Login ke BNI Internet Banking.',
      'Pilih menu Transaksi > Pembayaran Tagihan > Virtual Account Billing.',
      'Masukkan nomor VA dan konfirmasi dengan BNI e-Secure.'
    ]
  }
};

// GET PAYMENT DATA & QR CODE DATA-URL
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    let paymentDetails = {};
    try {
      paymentDetails = JSON.parse(order.payment_details);
    } catch (e) {
      paymentDetails = {};
    }

    let qrDataUrl = null;
    let bankInstructions = null;

    if (order.payment_method === 'qris') {
      const qrString = paymentDetails.qr_string || `NPDCLUB-QRIS-${order.order_number}-${order.total_amount}`;
      try {
        qrDataUrl = await QRCode.toDataURL(qrString, {
          width: 320,
          margin: 2,
          color: {
            dark: '#0B1F3A',
            light: '#FFFFFF'
          }
        });
      } catch (err) {
        console.error('QR code generation failed:', err);
      }
    } else {
      const bank = paymentDetails.bank || 'BCA';
      bankInstructions = VA_INSTRUCTIONS[bank] || VA_INSTRUCTIONS.BCA;
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    res.json({
      success: true,
      order: {
        ...order,
        payment_details: paymentDetails,
        qr_data_url: qrDataUrl,
        instructions: bankInstructions,
        items
      }
    });
  } catch (err) {
    console.error('Get payment details error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail pembayaran.' });
  }
});

// SIMULATE PAYMENT SUCCESS (Development / Demo sandbox)
// Deducts actual stock, clears reserved_stock, sets status to 'paid'
router.post('/simulate/:orderNumber', (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status === 'paid') {
      return res.json({ success: true, message: 'Pesanan sudah berstatus LUNAS.', status: 'paid' });
    }

    const items = db.prepare('SELECT variant_id, quantity FROM order_items WHERE order_id = ?').all(order.id);

    const payTx = db.transaction(() => {
      // 1. Deduct actual stock and release reserved stock
      const deductStockStmt = db.prepare(`
        UPDATE product_variants
        SET stock = MAX(0, stock - ?),
            reserved_stock = MAX(0, reserved_stock - ?)
        WHERE id = ?
      `);

      for (const item of items) {
        deductStockStmt.run(item.quantity, item.quantity, item.variant_id);
      }

      // 2. Mark order as paid
      db.prepare(`
        UPDATE orders
        SET status = 'paid', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(order.id);
    });

    payTx();

    console.log(`[PAYMENT SIMULATED] Order ${orderNumber} is now PAID. Stock deducted successfully.`);

    res.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi! Stok produk telah diperbarui.',
      status: 'paid'
    });
  } catch (err) {
    console.error('Payment simulation error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses simulasi pembayaran.' });
  }
});

// MIDTRANS WEBHOOK NOTIFICATION ENDPOINT
router.post('/webhook', (req, res) => {
  try {
    const notification = req.body;
    console.log('[MIDTRANS/XENDIT WEBHOOK RECEIVED]:', notification);

    const orderNumber = notification.order_id || notification.external_id;
    const transactionStatus = notification.transaction_status || notification.status;

    if (!orderNumber) {
      return res.status(400).send('Order id missing');
    }

    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    if (transactionStatus === 'settlement' || transactionStatus === 'capture' || transactionStatus === 'PAID') {
      if (order.status !== 'paid') {
        const items = db.prepare('SELECT variant_id, quantity FROM order_items WHERE order_id = ?').all(order.id);

        const payTx = db.transaction(() => {
          const deductStock = db.prepare(`
            UPDATE product_variants
            SET stock = MAX(0, stock - ?),
                reserved_stock = MAX(0, reserved_stock - ?)
            WHERE id = ?
          `);

          for (const item of items) {
            deductStock.run(item.quantity, item.quantity, item.variant_id);
          }

          db.prepare(`UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(order.id);
        });

        payTx();
        console.log(`Order ${orderNumber} marked as PAID via webhook.`);
      }
    } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
      if (order.status === 'pending') {
        const items = db.prepare('SELECT variant_id, quantity FROM order_items WHERE order_id = ?').all(order.id);

        const cancelTx = db.transaction(() => {
          const releaseStock = db.prepare(`
            UPDATE product_variants
            SET reserved_stock = MAX(0, reserved_stock - ?)
            WHERE id = ?
          `);

          for (const item of items) {
            releaseStock.run(item.quantity, item.variant_id);
          }

          db.prepare(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
            .run(transactionStatus === 'expire' ? 'expired' : 'cancelled', order.id);
        });

        cancelTx();
        console.log(`Order ${orderNumber} marked as ${transactionStatus} via webhook.`);
      }
    }

    res.status(200).json({ status: 'OK' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
