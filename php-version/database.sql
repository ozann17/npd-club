-- ============================================================================
-- DATABASE SCHEMA & SEED DATA UNTUK NPD CLUB (PHP & MySQL)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `npd_club` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `npd_club`;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Collections
CREATE TABLE IF NOT EXISTS `collections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `badge` VARCHAR(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `collection_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `price` INT NOT NULL,
  `original_price` INT NULL,
  `images` TEXT NOT NULL, -- JSON format: ["assets/products/foto1.png", "assets/products/foto2.jpg"]
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Product Variants (Ukuran & Warna & Stok)
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `size` VARCHAR(20) NOT NULL,
  `color` VARCHAR(50) NOT NULL,
  `color_code` VARCHAR(20) NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `reserved_stock` INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Wishlists
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NULL,
  `shipping_name` VARCHAR(100) NOT NULL,
  `shipping_phone` VARCHAR(30) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `shipping_city` VARCHAR(100) NOT NULL,
  `shipping_postal_code` VARCHAR(20) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `subtotal` INT NOT NULL,
  `shipping_fee` INT NOT NULL DEFAULT 0,
  `total_amount` INT NOT NULL,
  `status` ENUM('pending', 'paid', 'expired', 'cancelled') DEFAULT 'pending',
  `va_number` VARCHAR(50) NULL,
  `qris_data` TEXT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel Order Items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `variant_id` INT NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `size` VARCHAR(20) NOT NULL,
  `color` VARCHAR(50) NOT NULL,
  `price` INT NOT NULL,
  `quantity` INT NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- INSERT SEED DATA
-- ============================================================================

-- Collections
INSERT INTO `collections` (`id`, `name`, `slug`, `description`, `badge`) VALUES
(1, 'NPD Collection', 'npd-collection', 'The core signature streetwear drop. Heavyweight boxy fits and archival graphics.', 'SIGNATURE DROP'),
(2, 'TDB Collection', 'tdb-collection', 'Beyond trends, beyond guidelines. We reflect the spirit, music, and raw identity of the streets.', 'TDB 2026'),
(3, 'Pick Me Collection', 'pickme-collection', 'Elevate your everyday look with functional cuts, versatile tones, and clean silhouettes.', 'PICK ME GEAR')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Demo User (Password: password123)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`) VALUES
(1, 'Fauzan NPD', 'demo@npdclub.com', '081234567890', '$2a$10$7rvy4QZqGfO3j1B6H2pS2.Z3/Xm5HqfS7w0J9H8N2V6B5N1M0K8L')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Products
INSERT INTO `products` (`id`, `collection_id`, `name`, `slug`, `description`, `price`, `original_price`, `images`, `is_featured`) VALUES
(1, 1, 'Npd 1st Special Drop', 'npd-cardiff-heavyweight-tee', 'Heavyweight 240 GSM combed cotton t-shirt with classic NPD CLUB Cardiff screenprint branding. Boxy oversized fit with reinforced double-needle ribbed collar and dropped shoulders.', 249000, 299000, '[\"assets/products/IMG_1274.PNG\", \"assets/products/model1.jpg\"]', 1),
(2, 1, 'NPD Longsleeve TEE', 'npd-brussels-graphic-tee', 'Signature Brussels typography drop on heavyweight dark charcoal base. Features rubberized high-density print on the chest and embroidered NPD emblem at the nape.', 249000, 289000, '[\"assets/products/IMG_1269.PNG\", \"assets/products/model2.jpg\"]', 1),
(3, 1, 'NPD White Tee - Dead Stock (SOLD OUT,THANKS!)', 'npd-moskva-capsule-tee', 'Extremely limited Moskva capsule release. Premium heavyweight 16s vintage open-end jersey. Semua varian sengaja dibuat stok 0 untuk mendemonstrasikan status Sold Out otomatis.', 269000, 320000, '[\"assets/products/IMG_1293.PNG\", \"assets/products/model4.jpg\"]', 1),
(4, 1, 'NPD White Tee (Trash Stock)', 'npd-archive-boxy-hoodie', '450 GSM ultra-heavyweight brushed French terry cotton. Custom boxy cut without drawstrings for an ultra-clean streetwear silhouette. Hidden kangaroo pocket.', 549000, 649000, '[\"assets/products/IMG_1271.PNG\", \"assets/products/model3.jpg\"]', 1),

(5, 2, 'TDB Art TGIIE', 'npd-spring-lightweight-mesh-tee', 'Double-layered breathable athletic mesh construction engineered for warm transitional weather. Relaxed drop shoulder with contrast side-stripe piping.', 300000, 550000, '[\"assets/products/IMG_1322.PNG\", \"assets/products/model_jules.jpg\"]', 1),
(6, 2, 'TDB Art Small LOGO', 'npd-relaxed-nylon-coach-jacket', 'Water-resistant taslan nylon shell with breathable cotton jersey inner lining. Matte snap-button closure, elasticated cuffs, and adjustable hem drawcord.', 300000, 559000, '[\"assets/products/IMG_1319.PNG\", \"assets/products/model_alex.jpg\"]', 0),
(7, 2, 'TDB 1st Jacket', 'npd-wide-leg-pleated-cargo', 'Relaxed wide-leg cargo pants crafted from durable cotton twill. Ergonomic 3D bellows pockets with zip closures and modular strap accents.', 650000, 890000, '[\"assets/products/IMG_1321.PNG\", \"assets/products/model_liam.jpg\"]', 1),
(8, 2, 'NPD PASTEL DYE OVERSIZED TEE', 'npd-pastel-dye-oversized-tee', 'Individual garment pigment-dyed for a soft subtle wash. 220 GSM luxury ring-spun cotton with ribbed mock neck.', 239000, 279000, '[\"assets/products/IMG_1314.PNG\", \"assets/products/model_john.jpg\"]', 0),

(9, 3, 'Pick me Art Enpidi', 'npd-thermal-sherpa-fleece-jacket', 'High-pile bonded thermal sherpa jacket with contrast taslan storm collar and zip chest panel. Engineered to trap maximum body warmth while maintaining a boxy cut.', 350000, 799000, '[\"assets/products/IMG_1433.PNG\", \"assets/products/modelpb.jpg\"]', 1),
(10, 3, 'Pick Me Art Odlanorc', 'npd-winter-tactical-puffer-coat', 'Down-alternative insulation with matte weatherproof micro-ripstop shell. Concealed storm flap, dual-way YKK zippers, fleece-lined handwarmer pockets.', 350000, 550000, '[\"assets/products/IMG_1432.PNG\", \"assets/products/modelmessi.webp\"]', 1),
(11, 3, 'Pick Me art Tylor Durden', 'npd-heavyweight-balaclava-hoodie', 'Special edition winter hoodie with integrated cross-collar face cover balaclava. 500 GSM loopback cotton fleece with thermal waffle lining.', 350000, 689000, '[\"assets/products/IMG_1431.PNG\", \"assets/products/modeloliv.webp\"]', 0),
(12, 3, 'Pick Me Art YONMP (SOLD OUT DEMO)', 'npd-arctic-beanie-glove-set', '100% Merino wool knit beanie and touchscreen-compatible thermal gloves. Completely sold out winter accessory bundle.', 189000, 229000, '[\"assets/products/IMG_1427.PNG\", \"assets/products/modelROc.webp\"]', 0)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Variants
INSERT INTO `product_variants` (`product_id`, `size`, `color`, `color_code`, `stock`) VALUES
(1, 'S', 'Mint Green', '#98FB98', 12),
(1, 'M', 'Mint Green', '#98FB98', 8),
(1, 'L', 'Mint Green', '#98FB98', 5),
(1, 'XL', 'Mint Green', '#98FB98', 3),

(2, 'S', 'Dark Charcoal', '#232323', 4),
(2, 'M', 'Dark Charcoal', '#232323', 2),
(2, 'L', 'Dark Charcoal', '#232323', 0),
(2, 'XL', 'Dark Charcoal', '#232323', 0),

(3, 'S', 'White', '#FFFFFF', 0),
(3, 'M', 'White', '#FFFFFF', 0),
(3, 'L', 'White', '#FFFFFF', 0),
(3, 'XL', 'White', '#FFFFFF', 0),

(4, 'S', 'Brown', '#A52A2A', 5),
(4, 'M', 'Brown', '#A52A2A', 10),
(4, 'L', 'Brown', '#A52A2A', 7),
(4, 'XL', 'Brown', '#A52A2A', 4),

(5, 'S', 'Chalk White', '#F7F7F7', 8),
(5, 'M', 'Chalk White', '#F7F7F7', 14),
(5, 'L', 'Chalk White', '#F7F7F7', 9),
(5, 'XL', 'Chalk White', '#F7F7F7', 5),

(6, 'S', 'Dark', '#000000', 4),
(6, 'M', 'Dark', '#010811', 6),
(6, 'L', 'Dark', '#000000', 5),
(6, 'XL', 'Dark', '#000000', 2),

(7, 'S', 'Dark Navy', '#1B2A4A', 3),
(7, 'M', 'Dark Navy', '#1B2A4A', 7),
(7, 'L', 'Dark Navy', '#1B2A4A', 0),
(7, 'XL', 'Dark Navy', '#1B2A4A', 2),

(8, 'S', 'Light Grey', '#D3D3D3', 6),
(8, 'M', 'Light Grey', '#D3D3D3', 8),
(8, 'L', 'Light Grey', '#D3D3D3', 5),
(8, 'XL', 'Light Grey', '#D3D3D3', 3),

(9, 'S', 'Pink', '#FF69B4', 5),
(9, 'M', 'Pink', '#FF69B4', 4),
(9, 'L', 'Pink', '#FF69B4', 3),
(9, 'XL', 'Pink', '#FF69B4', 2),

(10, 'S', 'Green Army', '#4B5320', 2),
(10, 'M', 'Green Army', '#4B5320', 4),
(10, 'L', 'Green Army', '#4B5320', 3),
(10, 'XL', 'Green Army', '#4B5320', 1),

(11, 'S', 'Dark Navy', '#1B2A4A', 3),
(11, 'M', 'Dark Navy', '#1B2A4A', 5),
(11, 'L', 'Dark Navy', '#1B2A4A', 2),
(11, 'XL', 'Dark Navy', '#1B2A4A', 0),

(12, 'ONE SIZE', 'Light Grey', '#D3D3D3', 0);
