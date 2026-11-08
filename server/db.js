  const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'npd_club.sqlite');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      reset_token TEXT,
      reset_token_expiry DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      badge TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      images TEXT NOT NULL, -- JSON array of image URLs
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      size TEXT NOT NULL, -- S, M, L, XL
      color TEXT NOT NULL,
      color_code TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      reserved_stock INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      variant_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_postal_code TEXT NOT NULL,
      payment_method TEXT NOT NULL, -- 'qris', 'bca_va', 'bri_va', 'mandiri_va', 'bni_va'
      payment_details TEXT, -- JSON string with QRIS code or VA details
      subtotal INTEGER NOT NULL,
      shipping_fee INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'expired', 'cancelled'
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      size TEXT NOT NULL,
      color TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    );
  `);

  seedData();
}

function seedData() {
  const collectionCount = db.prepare('SELECT COUNT(*) as count FROM collections').get().count;
  if (collectionCount > 0) {
    return; // Already seeded
  }

  console.log('Seeding initial data for NPD CLUB...');

  /* ==========================================================================
     [EDIT DI SINI] 1. DAFTAR 3 KOLEKSI UTAMA (NPD, SPRING, WINTER)
     Anda bisa mengubah nama koleksi, deskripsi, dan badge-nya di bawah ini:
     ========================================================================== */
  const insertCollection = db.prepare(`
    INSERT INTO collections (name, slug, description, badge)
    VALUES (@name, @slug, @description, @badge)
  `);

  const collections = [
    {
      name: 'NPD Collection',
      slug: 'npd-collection',
      description: 'The core signature streetwear drop. Heavyweight boxy fits and archival graphics.',
      badge: 'SIGNATURE DROP'
    },
    {
      name: 'TDB Collection',
      slug: 'tdb-collection',
      description: 'Lightweight breathable silhouettes engineered for transitioning seasons.',
      badge: 'TDB 2026'
    },
    {
      name: 'Pick Me Collection',
      slug: 'pickme-collection',
      description: 'Heavy French terry, insulated sherpa, and tactical fleece streetwear.',
      badge: 'PICK ME GEAR'
    }
  ];

  const colIds = {};
  for (const c of collections) {
    const res = insertCollection.run(c);
    colIds[c.slug] = res.lastInsertRowid;
  }

  // Akun Demo Pengguna Bawaan (password: password123)
  const passwordHash = bcrypt.hashSync('password123', 10);
  db.prepare(`
    INSERT INTO users (name, email, phone, password_hash)
    VALUES (?, ?, ?, ?)
  `).run('Fauzan NPD', 'demo@npdclub.com', '081234567890', passwordHash);

  // Statements untuk produk & varian
  const insertProduct = db.prepare(`
    INSERT INTO products (collection_id, name, slug, description, price, original_price, images, is_featured)
    VALUES (@collection_id, @name, @slug, @description, @price, @original_price, @images, @is_featured)
  `);

  const insertVariant = db.prepare(`
    INSERT INTO product_variants (product_id, size, color, color_code, stock, reserved_stock)
    VALUES (@product_id, @size, @color, @color_code, @stock, 0)
  `);

  /* ==========================================================================
     [EDIT DI SINI] 2. DAFTAR PRODUK KATALOG (NAMA, HARGA, FOTO 1 & 2, VARIAN)
     PETUNJUK PENGEDITAN:
     - name: Nama item produk
     - price: Harga jual dalam Rupiah (contoh: 249000)
     - original_price: Harga coret diskon (opsional)
     - images: [
         'Foto 1: Foto Katalog Packshot / Baju Saja',
         'Foto 2: Foto Saat Dipakai Model / Lookbook'
       ]
       * Anda bisa gunakan link URL online, atau simpan di folder client/public/products/
         lalu tulis path-nya: '/products/nama-foto.jpg'
     ========================================================================== */
  const products = [
    // --------------------------------------------------------------------------
    // KOLEKSI 1: NPD COLLECTION (Signature Drop)
    // --------------------------------------------------------------------------
    {
      collection_slug: 'npd-collection',
      name: 'Npd 1st Special Drop',
      slug: 'npd-cardiff-heavyweight-tee',
      description: 'Heavyweight 240 GSM combed cotton t-shirt with classic NPD CLUB Cardiff screenprint branding. Boxy oversized fit with reinforced double-needle ribbed collar and dropped shoulders.',
      price: 249000,
      original_price: 299000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1274.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model1.jpg',
      ],
      variants: [
        { size: 'S', color: 'Mint Green', color_code: '#98FB98', stock: 12 },
        { size: 'M', color: 'Mint Green', color_code: '#98FB98', stock: 8 },
        { size: 'L', color: 'Mint Green', color_code: '#98FB98', stock: 5 },
        { size: 'XL', color: 'Mint Green', color_code: '#98FB98', stock: 3 }
        
      ]
    },
    {
      collection_slug: 'npd-collection',
      name: 'NPD Longsleeve TEE',
      slug: 'npd-brussels-graphic-tee',
      description: 'Signature Brussels typography drop on heavyweight dark charcoal base. Features rubberized high-density print on the chest and embroidered NPD emblem at the nape.',
      price: 249000,
      original_price: 289000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1269.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model2.jpg'
      ],
      variants: [
        { size: 'S', color: 'Dark Charcoal', color_code: '#232323', stock: 4 },
        { size: 'M', color: 'Dark Charcoal', color_code: '#232323', stock: 2 },
        { size: 'L', color: 'Dark Charcoal', color_code: '#232323', stock: 0 }, // Ukuran habis (dicoret)
        { size: 'XL', color: 'Dark Charcoal', color_code: '#232323', stock: 0 }  // Ukuran habis (dicoret)
      ]
    },
    {
      collection_slug: 'npd-collection',
      name: 'NPD White Tee - Dead Stock (SOLD OUT,THANKS!)',
      slug: 'npd-moskva-capsule-tee',
      description: 'Extremely limited Moskva capsule release. Premium heavyweight 16s vintage open-end jersey. Semua varian sengaja dibuat stok 0 untuk mendemonstrasikan status Sold Out otomatis.',
      price: 269000,
      original_price: 320000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1293.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model4.jpg'
      ],
      variants: [
        // Seluruh varian 0 stock -> Menghasilkan badge SOLD OUT
        { size: 'S', color: 'White', color_code: '#FFFFFF', stock: 0 },
        { size: 'M', color: 'White', color_code: '#FFFFFF', stock: 0 },
        { size: 'L', color: 'White', color_code: '#FFFFFF', stock: 0 },
        { size: 'XL', color: 'White', color_code: '#FFFFFF', stock: 0 }
      ]
    },
    {
      collection_slug: 'npd-collection',
      name: 'NPD White Tee (Trash Stock)',
      slug: 'npd-archive-boxy-hoodie',
      description: '450 GSM ultra-heavyweight brushed French terry cotton. Custom boxy cut without drawstrings for an ultra-clean streetwear silhouette. Hidden kangaroo pocket.',
      price: 549000,
      original_price: 649000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1271.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model3.jpg',
      ],
      variants: [
        { size: 'S', color: 'Brown', color_code: '#A52A2A', stock: 5 },
        { size: 'M', color: 'Brown', color_code: '#A52A2A', stock: 10 },
        { size: 'L', color: 'Brown', color_code: '#A52A2A', stock: 7 },
        { size: 'XL', color: 'Brown', color_code: '#A52A2A', stock: 4 }
      ]
    },

    // --------------------------------------------------------------------------
    // KOLEKSI 2: TDB COLLECTION 2026
    // --------------------------------------------------------------------------
    {
      collection_slug: 'tdb-collection',
      name: 'TDB Art TGIIE',
      slug: 'npd-spring-lightweight-mesh-tee',
      description: 'Double-layered breathable athletic mesh construction engineered for warm transitional weather. Relaxed drop shoulder with contrast side-stripe piping.',
      price: 300000,
      original_price: 550000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
         '/products/IMG_1322.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model_jules.jpg',
      ],
      variants: [
        { size: 'S', color: 'Chalk White', color_code: '#F7F7F7', stock: 8 },
        { size: 'M', color: 'Chalk White', color_code: '#F7F7F7', stock: 14 },
        { size: 'L', color: 'Chalk White', color_code: '#F7F7F7', stock: 9 },
        { size: 'XL', color: 'Chalk White', color_code: '#F7F7F7', stock: 5 }
      ]
    },
    {
      collection_slug: 'tdb-collection',
      name: 'TDB Art Small LOGO',
      slug: 'npd-relaxed-nylon-coach-jacket',
      description: 'Water-resistant taslan nylon shell with breathable cotton jersey inner lining. Matte snap-button closure, elasticated cuffs, and adjustable hem drawcord.',
      price: 300000,
      original_price: 559000,
      is_featured: 0,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1319.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model_alex.jpg'
      ],
      variants: [
        { size: 'S', color: 'Dark', color_code: '#000000', stock: 4 },
        { size: 'M', color: 'Dark', color_code: '#010811', stock: 6 },
        { size: 'L', color: 'Dark', color_code: '#000000', stock: 5 },
        { size: 'XL', color: 'Dark', color_code: '#000000', stock: 2 }
      ]
    },
    {
      collection_slug: 'tdb-collection',
      name: 'TDB 1st Jacket',
      slug: 'npd-wide-leg-pleated-cargo',
      description: 'Relaxed wide-leg cargo pants crafted from durable cotton twill. Ergonomic 3D bellows pockets with zip closures and modular strap accents.',
      price: 650000,
      original_price: 890000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1321.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model_liam.jpg'
      ],
      variants: [
        { size: 'S', color: 'Dark Navy', color_code: '#1B2A4A', stock: 3 },
        { size: 'M', color: 'Dark Navy', color_code: '#1B2A4A', stock: 7 },
        { size: 'L', color: 'Dark Navy', color_code: '#1B2A4A', stock: 0 },
        { size: 'XL', color: 'Dark Navy', color_code: '#1B2A4A', stock: 2 }
      ]
    },
    {
      collection_slug: 'tdb-collection',
      name: 'NPD PASTEL DYE OVERSIZED TEE',
      slug: 'npd-pastel-dye-oversized-tee',
      description: 'Individual garment pigment-dyed for a soft subtle wash. 220 GSM luxury ring-spun cotton with ribbed mock neck.',
      price: 239000,
      original_price: 279000,
      is_featured: 0,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1314.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/model_john.jpg'
      ],
      variants: [
        { size: 'S', color: 'Light Grey', color_code: '#D3D3D3', stock: 6 },
        { size: 'M', color: 'Light Grey', color_code: '#D3D3D3', stock: 8 },
        { size: 'L', color: 'Light Grey', color_code: '#D3D3D3', stock: 5 },
        { size: 'XL', color: 'Light Grey', color_code: '#D3D3D3', stock: 3 }
      ]
    },

    // --------------------------------------------------------------------------
    // KOLEKSI 3: PICK ME COLLECTION
    // --------------------------------------------------------------------------
    {
      collection_slug: 'pickme-collection',
      name: 'Pick me Art Enpidi',
      slug: 'npd-thermal-sherpa-fleece-jacket',
      description: 'High-pile bonded thermal sherpa jacket with contrast taslan storm collar and zip chest panel. Engineered to trap maximum body warmth while maintaining a boxy cut.',
      price: 350000,
      original_price: 799000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1433.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/modelpb.jpg',
      ],
      variants: [
        { size: 'S', color: 'Pink', color_code: '#FF69B4', stock: 5 },
        { size: 'M', color: 'Pink', color_code: '#FF69B4', stock: 4 },
        { size: 'L', color: 'Pink', color_code: '#FF69B4', stock: 3 },
        { size: 'XL', color: 'Pink', color_code: '#FF69B4', stock: 2 }
      ]
    },
    {
      collection_slug: 'pickme-collection',
      name: 'Pick Me Art Odlanorc',
      slug: 'npd-winter-tactical-puffer-coat',
      description: 'Down-alternative insulation with matte weatherproof micro-ripstop shell. Concealed storm flap, dual-way YKK zippers, fleece-lined handwarmer pockets.',
      price: 350000,
      original_price: 550000,
      is_featured: 1,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1432.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/modelmessi.webp',
      ],
      variants: [
        { size: 'S', color: 'Green Army', color_code: '#4B5320', stock: 2 },
        { size: 'M', color: 'Green Army', color_code: '#4B5320', stock: 4 },
        { size: 'L', color: 'Green Army', color_code: '#4B5320', stock: 3 },
        { size: 'XL', color: 'Green Army', color_code: '#4B5320', stock: 1 }
      ]
    },
    {
      collection_slug: 'pickme-collection',
      name: 'Pick Me art Tylor Durden',
      slug: 'npd-heavyweight-balaclava-hoodie',
      description: 'Special edition winter hoodie with integrated cross-collar face cover balaclava. 500 GSM loopback cotton fleece with thermal waffle lining.',
      price: 350000,
      original_price: 689000,
      is_featured: 0,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1431.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/modeloliv.webp'
      ],
      variants: [
        { size: 'S', color: 'Dark Navy', color_code: '#1B2A4A', stock: 3 },
        { size: 'M', color: 'Dark Navy', color_code: '#1B2A4A', stock: 5 },
        { size: 'L', color: 'Dark Navy', color_code: '#1B2A4A', stock: 2 },
        { size: 'XL', color: 'Dark Navy', color_code: '#1B2A4A', stock: 0 }
      ]
    },
    {
      collection_slug: 'pickme-collection',
      name: 'Pick Me Art YONMP (SOLD OUT DEMO)',
      slug: 'npd-arctic-beanie-glove-set',
      description: '100% Merino wool knit beanie and touchscreen-compatible thermal gloves. Completely sold out winter accessory bundle.',
      price: 189000,
      original_price: 229000,
      is_featured: 0,
      images: [
        // [FOTO 1: KATALOG PACKSHOT]
        '/products/IMG_1427.PNG',
        // [FOTO 2: MODEL LOOKBOOK]
        '/products/modelROc.webp'
      ],
      variants: [
        { size: 'ONE SIZE', color: 'Light Grey', color_code: '#D3D3D3', stock: 0 },
        { size: 'ONE SIZE', color: 'Light Grey', color_code: '#D3D3D3', stock: 0 }
      ]
    }
  ];

  for (const p of products) {
    const res = insertProduct.run({
      collection_id: colIds[p.collection_slug],
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      original_price: p.original_price,
      images: JSON.stringify(p.images),
      is_featured: p.is_featured
    });
    const productId = res.lastInsertRowid;

    for (const v of p.variants) {
      insertVariant.run({
        product_id: productId,
        size: v.size,
        color: v.color,
        color_code: v.color_code,
        stock: v.stock
      });
    }
  }

  console.log('Database initialized and seeded successfully.');
}

// Cleanup expired orders and return reserved stocks (runs periodically)
function checkExpiredOrders() {
  try {
    const expiredOrders = db.prepare(`
      SELECT id, order_number FROM orders
      WHERE status = 'pending' AND datetime(expires_at) < datetime('now')
    `).all();

    if (expiredOrders.length > 0) {
      const updateOrder = db.prepare(`UPDATE orders SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
      const getItems = db.prepare(`SELECT variant_id, quantity FROM order_items WHERE order_id = ?`);
      const releaseReserved = db.prepare(`
        UPDATE product_variants
        SET reserved_stock = MAX(0, reserved_stock - ?)
        WHERE id = ?
      `);

      const tx = db.transaction(() => {
        for (const order of expiredOrders) {
          const items = getItems.all(order.id);
          for (const item of items) {
            releaseReserved.run(item.quantity, item.variant_id);
          }
          updateOrder.run(order.id);
          console.log(`Order ${order.order_number} expired, reserved stocks returned.`);
        }
      });

      tx();
    }
  } catch (err) {
    console.error('Error during expired orders check:', err);
  }
}

// Check every 30 seconds
setInterval(checkExpiredOrders, 30000);

module.exports = {
  db,
  initDb,
  checkExpiredOrders
};
