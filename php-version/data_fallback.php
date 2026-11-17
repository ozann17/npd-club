<?php
// Fallback Data Produk & Koleksi (Aktif otomatis jika MySQL belum terhubung)

$FALLBACK_COLLECTIONS = [
    [
        'id' => 1,
        'name' => 'NPD Collection',
        'slug' => 'npd-collection',
        'description' => 'Koleksi inti dengan potongan boxy oversized, katun combed 240+ GSM, dan grafis legendaris khas NPD CLUB.',
        'badge' => 'SIGNATURE DROP'
    ],
    [
        'id' => 2,
        'name' => 'TDB Collection',
        'slug' => 'tdb-collection',
        'description' => 'Beyond trends, beyond guidelines. We reflect the spirit, music, and raw identity of the streets.',
        'badge' => 'TDB 2026'
    ],
    [
        'id' => 3,
        'name' => 'Pick Me Collection',
        'slug' => 'pickme-collection',
        'description' => 'Elevate your everyday look with functional cuts, versatile tones, and clean silhouettes.',
        'badge' => 'PICK ME GEAR'
    ]
];

$FALLBACK_PRODUCTS = [
    // KOLEKSI 1: NPD COLLECTION
    [
        'id' => 1,
        'collection_slug' => 'npd-collection',
        'collection_name' => 'NPD Collection',
        'name' => 'Npd 1st Special Drop',
        'slug' => 'npd-cardiff-heavyweight-tee',
        'description' => 'Heavyweight 240 GSM combed cotton t-shirt with classic NPD CLUB Cardiff screenprint branding. Boxy oversized fit with reinforced double-needle ribbed collar and dropped shoulders.',
        'price' => 249000,
        'original_price' => 299000,
        'images' => ['assets/products/IMG_1274.PNG', 'assets/products/model1.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Mint Green', 'code' => '#98FB98']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Mint Green', 'stock' => 12],
            ['size' => 'M', 'color' => 'Mint Green', 'stock' => 8],
            ['size' => 'L', 'color' => 'Mint Green', 'stock' => 5],
            ['size' => 'XL', 'color' => 'Mint Green', 'stock' => 3]
        ]
    ],
    [
        'id' => 2,
        'collection_slug' => 'npd-collection',
        'collection_name' => 'NPD Collection',
        'name' => 'NPD Longsleeve TEE',
        'slug' => 'npd-brussels-graphic-tee',
        'description' => 'Signature Brussels typography drop on heavyweight dark charcoal base. Features rubberized high-density print on the chest and embroidered NPD emblem at the nape.',
        'price' => 249000,
        'original_price' => 289000,
        'images' => ['assets/products/IMG_1269.PNG', 'assets/products/model2.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Dark Charcoal', 'code' => '#232323']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Dark Charcoal', 'stock' => 4],
            ['size' => 'M', 'color' => 'Dark Charcoal', 'stock' => 2],
            ['size' => 'L', 'color' => 'Dark Charcoal', 'stock' => 0],
            ['size' => 'XL', 'color' => 'Dark Charcoal', 'stock' => 0]
        ]
    ],
    [
        'id' => 3,
        'collection_slug' => 'npd-collection',
        'collection_name' => 'NPD Collection',
        'name' => 'NPD White Tee - Dead Stock (SOLD OUT,THANKS!)',
        'slug' => 'npd-moskva-capsule-tee',
        'description' => 'Extremely limited Moskva capsule release. Premium heavyweight 16s vintage open-end jersey. Semua varian sengaja dibuat stok 0 untuk mendemonstrasikan status Sold Out otomatis.',
        'price' => 269000,
        'original_price' => 320000,
        'images' => ['assets/products/IMG_1293.PNG', 'assets/products/model4.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'White', 'code' => '#FFFFFF']],
        'is_sold_out' => true,
        'variants' => [
            ['size' => 'S', 'color' => 'White', 'stock' => 0],
            ['size' => 'M', 'color' => 'White', 'stock' => 0],
            ['size' => 'L', 'color' => 'White', 'stock' => 0],
            ['size' => 'XL', 'color' => 'White', 'stock' => 0]
        ]
    ],
    [
        'id' => 4,
        'collection_slug' => 'npd-collection',
        'collection_name' => 'NPD Collection',
        'name' => 'NPD White Tee (Trash Stock)',
        'slug' => 'npd-archive-boxy-hoodie',
        'description' => '450 GSM ultra-heavyweight brushed French terry cotton. Custom boxy cut without drawstrings for an ultra-clean streetwear silhouette. Hidden kangaroo pocket.',
        'price' => 549000,
        'original_price' => 649000,
        'images' => ['assets/products/IMG_1271.PNG', 'assets/products/model3.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Brown', 'code' => '#A52A2A']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Brown', 'stock' => 5],
            ['size' => 'M', 'color' => 'Brown', 'stock' => 10],
            ['size' => 'L', 'color' => 'Brown', 'stock' => 7],
            ['size' => 'XL', 'color' => 'Brown', 'stock' => 4]
        ]
    ],

    // KOLEKSI 2: TDB COLLECTION
    [
        'id' => 5,
        'collection_slug' => 'tdb-collection',
        'collection_name' => 'TDB Collection',
        'name' => 'TDB Art TGIIE',
        'slug' => 'npd-spring-lightweight-mesh-tee',
        'description' => 'Double-layered breathable athletic mesh construction engineered for warm transitional weather. Relaxed drop shoulder with contrast side-stripe piping.',
        'price' => 300000,
        'original_price' => 550000,
        'images' => ['assets/products/IMG_1322.PNG', 'assets/products/model_jules.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Chalk White', 'code' => '#F7F7F7']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Chalk White', 'stock' => 8],
            ['size' => 'M', 'color' => 'Chalk White', 'stock' => 14],
            ['size' => 'L', 'color' => 'Chalk White', 'stock' => 9],
            ['size' => 'XL', 'color' => 'Chalk White', 'stock' => 5]
        ]
    ],
    [
        'id' => 6,
        'collection_slug' => 'tdb-collection',
        'collection_name' => 'TDB Collection',
        'name' => 'TDB Art Small LOGO',
        'slug' => 'npd-relaxed-nylon-coach-jacket',
        'description' => 'Water-resistant taslan nylon shell with breathable cotton jersey inner lining. Matte snap-button closure, elasticated cuffs, and adjustable hem drawcord.',
        'price' => 300000,
        'original_price' => 559000,
        'images' => ['assets/products/IMG_1319.PNG', 'assets/products/model_alex.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Dark', 'code' => '#000000']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Dark', 'stock' => 4],
            ['size' => 'M', 'color' => 'Dark', 'stock' => 6],
            ['size' => 'L', 'color' => 'Dark', 'stock' => 5],
            ['size' => 'XL', 'color' => 'Dark', 'stock' => 2]
        ]
    ],
    [
        'id' => 7,
        'collection_slug' => 'tdb-collection',
        'collection_name' => 'TDB Collection',
        'name' => 'TDB 1st Jacket',
        'slug' => 'npd-wide-leg-pleated-cargo',
        'description' => 'Relaxed wide-leg cargo pants crafted from durable cotton twill. Ergonomic 3D bellows pockets with zip closures and modular strap accents.',
        'price' => 650000,
        'original_price' => 890000,
        'images' => ['assets/products/IMG_1321.PNG', 'assets/products/model_liam.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Dark Navy', 'code' => '#1B2A4A']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Dark Navy', 'stock' => 3],
            ['size' => 'M', 'color' => 'Dark Navy', 'stock' => 7],
            ['size' => 'L', 'color' => 'Dark Navy', 'stock' => 0],
            ['size' => 'XL', 'color' => 'Dark Navy', 'stock' => 2]
        ]
    ],
    [
        'id' => 8,
        'collection_slug' => 'tdb-collection',
        'collection_name' => 'TDB Collection',
        'name' => 'NPD PASTEL DYE OVERSIZED TEE',
        'slug' => 'npd-pastel-dye-oversized-tee',
        'description' => 'Individual garment pigment-dyed for a soft subtle wash. 220 GSM luxury ring-spun cotton with ribbed mock neck.',
        'price' => 239000,
        'original_price' => 279000,
        'images' => ['assets/products/IMG_1314.PNG', 'assets/products/model_john.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Light Grey', 'code' => '#D3D3D3']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Light Grey', 'stock' => 6],
            ['size' => 'M', 'color' => 'Light Grey', 'stock' => 8],
            ['size' => 'L', 'color' => 'Light Grey', 'stock' => 5],
            ['size' => 'XL', 'color' => 'Light Grey', 'stock' => 3]
        ]
    ],

    // KOLEKSI 3: PICK ME COLLECTION
    [
        'id' => 9,
        'collection_slug' => 'pickme-collection',
        'collection_name' => 'Pick Me Collection',
        'name' => 'Pick me Art Enpidi',
        'slug' => 'npd-thermal-sherpa-fleece-jacket',
        'description' => 'High-pile bonded thermal sherpa jacket with contrast taslan storm collar and zip chest panel. Engineered to trap maximum body warmth while maintaining a boxy cut.',
        'price' => 350000,
        'original_price' => 799000,
        'images' => ['assets/products/IMG_1433.PNG', 'assets/products/modelpb.jpg'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Pink', 'code' => '#FF69B4']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Pink', 'stock' => 5],
            ['size' => 'M', 'color' => 'Pink', 'stock' => 4],
            ['size' => 'L', 'color' => 'Pink', 'stock' => 3],
            ['size' => 'XL', 'color' => 'Pink', 'stock' => 2]
        ]
    ],
    [
        'id' => 10,
        'collection_slug' => 'pickme-collection',
        'collection_name' => 'Pick Me Collection',
        'name' => 'Pick Me Art Odlanorc',
        'slug' => 'npd-winter-tactical-puffer-coat',
        'description' => 'Down-alternative insulation with matte weatherproof micro-ripstop shell. Concealed storm flap, dual-way YKK zippers, fleece-lined handwarmer pockets.',
        'price' => 350000,
        'original_price' => 550000,
        'images' => ['assets/products/IMG_1432.PNG', 'assets/products/modelmessi.webp'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Green Army', 'code' => '#4B5320']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Green Army', 'stock' => 2],
            ['size' => 'M', 'color' => 'Green Army', 'stock' => 4],
            ['size' => 'L', 'color' => 'Green Army', 'stock' => 3],
            ['size' => 'XL', 'color' => 'Green Army', 'stock' => 1]
        ]
    ],
    [
        'id' => 11,
        'collection_slug' => 'pickme-collection',
        'collection_name' => 'Pick Me Collection',
        'name' => 'Pick Me art Tylor Durden',
        'slug' => 'npd-heavyweight-balaclava-hoodie',
        'description' => 'Special edition winter hoodie with integrated cross-collar face cover balaclava. 500 GSM loopback cotton fleece with thermal waffle lining.',
        'price' => 350000,
        'original_price' => 689000,
        'images' => ['assets/products/IMG_1431.PNG', 'assets/products/modeloliv.webp'],
        'sizes' => ['S', 'M', 'L', 'XL'],
        'colors' => [['name' => 'Dark Navy', 'code' => '#1B2A4A']],
        'is_sold_out' => false,
        'variants' => [
            ['size' => 'S', 'color' => 'Dark Navy', 'stock' => 3],
            ['size' => 'M', 'color' => 'Dark Navy', 'stock' => 5],
            ['size' => 'L', 'color' => 'Dark Navy', 'stock' => 2],
            ['size' => 'XL', 'color' => 'Dark Navy', 'stock' => 0]
        ]
    ],
    [
        'id' => 12,
        'collection_slug' => 'pickme-collection',
        'collection_name' => 'Pick Me Collection',
        'name' => 'Pick Me Art YONMP (SOLD OUT DEMO)',
        'slug' => 'npd-arctic-beanie-glove-set',
        'description' => '100% Merino wool knit beanie and touchscreen-compatible thermal gloves. Completely sold out winter accessory bundle.',
        'price' => 189000,
        'original_price' => 229000,
        'images' => ['assets/products/IMG_1427.PNG', 'assets/products/modelROc.webp'],
        'sizes' => ['ONE SIZE'],
        'colors' => [['name' => 'Light Grey', 'code' => '#D3D3D3']],
        'is_sold_out' => true,
        'variants' => [
            ['size' => 'ONE SIZE', 'color' => 'Light Grey', 'stock' => 0]
        ]
    ]
];

function getProducts($collectionSlug = 'all') {
    global $pdo, $db_connected, $FALLBACK_PRODUCTS;

    if ($db_connected && $pdo) {
        try {
            $sql = "SELECT p.*, c.name as collection_name, c.slug as collection_slug 
                    FROM products p 
                    JOIN collections c ON p.collection_id = c.id";
            $params = [];
            if ($collectionSlug && $collectionSlug !== 'all') {
                $sql .= " WHERE c.slug = ?";
                $params[] = $collectionSlug;
            }
            $sql .= " ORDER BY p.id ASC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $products = $stmt->fetchAll();

            $result = [];
            foreach ($products as $p) {
                // Fetch variants
                $vStmt = $pdo->prepare("SELECT * FROM product_variants WHERE product_id = ?");
                $vStmt->execute([$p['id']]);
                $variants = $vStmt->fetchAll();

                $totalStock = array_sum(array_column($variants, 'stock'));
                $sizes = array_values(array_unique(array_column($variants, 'size')));
                
                $colors = [];
                foreach ($variants as $v) {
                    $colors[$v['color']] = ['name' => $v['color'], 'code' => $v['color_code']];
                }
                $colors = array_values($colors);

                $p['images'] = json_decode($p['images'], true) ?: [];
                $p['variants'] = $variants;
                $p['sizes'] = $sizes;
                $p['colors'] = $colors;
                $p['is_sold_out'] = ($totalStock <= 0);

                $result[] = $p;
            }
            return $result;
        } catch (Exception $e) {
            // Fallback if query error
        }
    }

    if (!$collectionSlug || $collectionSlug === 'all') {
        return $FALLBACK_PRODUCTS;
    }

    return array_values(array_filter($FALLBACK_PRODUCTS, function($p) use ($collectionSlug) {
        return $p['collection_slug'] === $collectionSlug;
    }));
}
?>
