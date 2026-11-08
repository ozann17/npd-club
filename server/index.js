const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { initDb } = require('./db');

dotenv.config();

// Initialize SQLite database and tables
initDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for API calls
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[${req.method}] ${req.url}`);
  }
  next();
});

// Mount API routes
const authRoutes = require('./auth').router;
const productRoutes = require('./routes/products');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'NPD CLUB',
    timestamp: new Date().toISOString()
  });
});

// Serve public folder (images, assets) and frontend build
const publicPath = path.join(__dirname, '..', 'client', 'public');
app.use(express.static(publicPath));

const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing (compatible with Express 5 / path-to-regexp 8+)
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('NPD CLUB Backend API is online. Vite frontend runs at http://localhost:3000');
    }
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`✦ NPD CLUB Server is running on port ${PORT}`);
  console.log(`✦ API endpoint: http://localhost:${PORT}/api`);
  console.log(`=========================================`);
});
