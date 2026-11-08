// Static fallback products data for GitHub Pages or offline mode
// Enables the complete NPD CLUB catalog to run 100% on client-side

export const STATIC_PRODUCTS = [
  // --------------------------------------------------------------------------
  // KOLEKSI 1: NPD COLLECTION
  // --------------------------------------------------------------------------
  {
    id: 1,
    collection_id: 1,
    collection_name: 'NPD Collection',
    collection_slug: 'npd-collection',
    name: 'Npd 1st Special Drop',
    slug: 'npd-cardiff-heavyweight-tee',
    description: 'Heavyweight 240 GSM combed cotton t-shirt with classic NPD CLUB Cardiff screenprint branding. Boxy oversized fit with reinforced double-needle ribbed collar and dropped shoulders.',
    price: 249000,
    original_price: 299000,
    is_featured: 1,
    images: [
      './products/IMG_1274.PNG',
      './products/model1.jpg'
    ],
    primary_image: './products/IMG_1274.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Mint Green', code: '#98FB98' }],
    total_stock: 28,
    total_available_stock: 28,
    is_sold_out: false,
    variants: [
      { id: 101, product_id: 1, size: 'S', color: 'Mint Green', color_code: '#98FB98', stock: 12, available_stock: 12 },
      { id: 102, product_id: 1, size: 'M', color: 'Mint Green', color_code: '#98FB98', stock: 8, available_stock: 8 },
      { id: 103, product_id: 1, size: 'L', color: 'Mint Green', color_code: '#98FB98', stock: 5, available_stock: 5 },
      { id: 104, product_id: 1, size: 'XL', color: 'Mint Green', color_code: '#98FB98', stock: 3, available_stock: 3 }
    ]
  },
  {
    id: 2,
    collection_id: 1,
    collection_name: 'NPD Collection',
    collection_slug: 'npd-collection',
    name: 'NPD Longsleeve TEE',
    slug: 'npd-brussels-graphic-tee',
    description: 'Signature Brussels typography drop on heavyweight dark charcoal base. Features rubberized high-density print on the chest and embroidered NPD emblem at the nape.',
    price: 249000,
    original_price: 289000,
    is_featured: 1,
    images: [
      './products/IMG_1269.PNG',
      './products/model2.jpg'
    ],
    primary_image: './products/IMG_1269.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Dark Charcoal', code: '#232323' }],
    total_stock: 6,
    total_available_stock: 6,
    is_sold_out: false,
    variants: [
      { id: 105, product_id: 2, size: 'S', color: 'Dark Charcoal', color_code: '#232323', stock: 4, available_stock: 4 },
      { id: 106, product_id: 2, size: 'M', color: 'Dark Charcoal', color_code: '#232323', stock: 2, available_stock: 2 },
      { id: 107, product_id: 2, size: 'L', color: 'Dark Charcoal', color_code: '#232323', stock: 0, available_stock: 0 },
      { id: 108, product_id: 2, size: 'XL', color: 'Dark Charcoal', color_code: '#232323', stock: 0, available_stock: 0 }
    ]
  },
  {
    id: 3,
    collection_id: 1,
    collection_name: 'NPD Collection',
    collection_slug: 'npd-collection',
    name: 'NPD White Tee - Dead Stock (SOLD OUT,THANKS!)',
    slug: 'npd-moskva-capsule-tee',
    description: 'Extremely limited Moskva capsule release. Premium heavyweight 16s vintage open-end jersey. Semua varian sengaja dibuat stok 0 untuk mendemonstrasikan status Sold Out otomatis.',
    price: 269000,
    original_price: 320000,
    is_featured: 1,
    images: [
      './products/IMG_1293.PNG',
      './products/model4.jpg'
    ],
    primary_image: './products/IMG_1293.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', code: '#FFFFFF' }],
    total_stock: 0,
    total_available_stock: 0,
    is_sold_out: true,
    variants: [
      { id: 109, product_id: 3, size: 'S', color: 'White', color_code: '#FFFFFF', stock: 0, available_stock: 0 },
      { id: 110, product_id: 3, size: 'M', color: 'White', color_code: '#FFFFFF', stock: 0, available_stock: 0 },
      { id: 111, product_id: 3, size: 'L', color: 'White', color_code: '#FFFFFF', stock: 0, available_stock: 0 },
      { id: 112, product_id: 3, size: 'XL', color: 'White', color_code: '#FFFFFF', stock: 0, available_stock: 0 }
    ]
  },
  {
    id: 4,
    collection_id: 1,
    collection_name: 'NPD Collection',
    collection_slug: 'npd-collection',
    name: 'NPD White Tee (Trash Stock)',
    slug: 'npd-archive-boxy-hoodie',
    description: '450 GSM ultra-heavyweight brushed French terry cotton. Custom boxy cut without drawstrings for an ultra-clean streetwear silhouette. Hidden kangaroo pocket.',
    price: 549000,
    original_price: 649000,
    is_featured: 1,
    images: [
      './products/IMG_1271.PNG',
      './products/model3.jpg'
    ],
    primary_image: './products/IMG_1271.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Brown', code: '#A52A2A' }],
    total_stock: 26,
    total_available_stock: 26,
    is_sold_out: false,
    variants: [
      { id: 113, product_id: 4, size: 'S', color: 'Brown', color_code: '#A52A2A', stock: 5, available_stock: 5 },
      { id: 114, product_id: 4, size: 'M', color: 'Brown', color_code: '#A52A2A', stock: 10, available_stock: 10 },
      { id: 115, product_id: 4, size: 'L', color: 'Brown', color_code: '#A52A2A', stock: 7, available_stock: 7 },
      { id: 116, product_id: 4, size: 'XL', color: 'Brown', color_code: '#A52A2A', stock: 4, available_stock: 4 }
    ]
  },

  // --------------------------------------------------------------------------
  // KOLEKSI 2: TDB COLLECTION
  // --------------------------------------------------------------------------
  {
    id: 5,
    collection_id: 2,
    collection_name: 'TDB Collection',
    collection_slug: 'tdb-collection',
    name: 'TDB Art TGIIE',
    slug: 'npd-spring-lightweight-mesh-tee',
    description: 'Double-layered breathable athletic mesh construction engineered for warm transitional weather. Relaxed drop shoulder with contrast side-stripe piping.',
    price: 300000,
    original_price: 550000,
    is_featured: 1,
    images: [
      './products/IMG_1322.PNG',
      './products/model_jules.jpg'
    ],
    primary_image: './products/IMG_1322.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Chalk White', code: '#F7F7F7' }],
    total_stock: 36,
    total_available_stock: 36,
    is_sold_out: false,
    variants: [
      { id: 201, product_id: 5, size: 'S', color: 'Chalk White', color_code: '#F7F7F7', stock: 8, available_stock: 8 },
      { id: 202, product_id: 5, size: 'M', color: 'Chalk White', color_code: '#F7F7F7', stock: 14, available_stock: 14 },
      { id: 203, product_id: 5, size: 'L', color: 'Chalk White', color_code: '#F7F7F7', stock: 9, available_stock: 9 },
      { id: 204, product_id: 5, size: 'XL', color: 'Chalk White', color_code: '#F7F7F7', stock: 5, available_stock: 5 }
    ]
  },
  {
    id: 6,
    collection_id: 2,
    collection_name: 'TDB Collection',
    collection_slug: 'tdb-collection',
    name: 'TDB Art Small LOGO',
    slug: 'npd-relaxed-nylon-coach-jacket',
    description: 'Water-resistant taslan nylon shell with breathable cotton jersey inner lining. Matte snap-button closure, elasticated cuffs, and adjustable hem drawcord.',
    price: 300000,
    original_price: 559000,
    is_featured: 0,
    images: [
      './products/IMG_1319.PNG',
      './products/model_alex.jpg'
    ],
    primary_image: './products/IMG_1319.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Dark', code: '#000000' }],
    total_stock: 17,
    total_available_stock: 17,
    is_sold_out: false,
    variants: [
      { id: 205, product_id: 6, size: 'S', color: 'Dark', color_code: '#000000', stock: 4, available_stock: 4 },
      { id: 206, product_id: 6, size: 'M', color: 'Dark', color_code: '#010811', stock: 6, available_stock: 6 },
      { id: 207, product_id: 6, size: 'L', color: 'Dark', color_code: '#000000', stock: 5, available_stock: 5 },
      { id: 208, product_id: 6, size: 'XL', color: 'Dark', color_code: '#000000', stock: 2, available_stock: 2 }
    ]
  },
  {
    id: 7,
    collection_id: 2,
    collection_name: 'TDB Collection',
    collection_slug: 'tdb-collection',
    name: 'TDB 1st Jacket',
    slug: 'npd-wide-leg-pleated-cargo',
    description: 'Relaxed wide-leg cargo pants crafted from durable cotton twill. Ergonomic 3D bellows pockets with zip closures and modular strap accents.',
    price: 650000,
    original_price: 890000,
    is_featured: 1,
    images: [
      './products/IMG_1321.PNG',
      './products/model_liam.jpg'
    ],
    primary_image: './products/IMG_1321.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Dark Navy', code: '#1B2A4A' }],
    total_stock: 12,
    total_available_stock: 12,
    is_sold_out: false,
    variants: [
      { id: 209, product_id: 7, size: 'S', color: 'Dark Navy', color_code: '#1B2A4A', stock: 3, available_stock: 3 },
      { id: 210, product_id: 7, size: 'M', color: 'Dark Navy', color_code: '#1B2A4A', stock: 7, available_stock: 7 },
      { id: 211, product_id: 7, size: 'L', color: 'Dark Navy', color_code: '#1B2A4A', stock: 0, available_stock: 0 },
      { id: 212, product_id: 7, size: 'XL', color: 'Dark Navy', color_code: '#1B2A4A', stock: 2, available_stock: 2 }
    ]
  },
  {
    id: 8,
    collection_id: 2,
    collection_name: 'TDB Collection',
    collection_slug: 'tdb-collection',
    name: 'NPD PASTEL DYE OVERSIZED TEE',
    slug: 'npd-pastel-dye-oversized-tee',
    description: 'Individual garment pigment-dyed for a soft subtle wash. 220 GSM luxury ring-spun cotton with ribbed mock neck.',
    price: 239000,
    original_price: 279000,
    is_featured: 0,
    images: [
      './products/IMG_1314.PNG',
      './products/model_john.jpg'
    ],
    primary_image: './products/IMG_1314.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Light Grey', code: '#D3D3D3' }],
    total_stock: 22,
    total_available_stock: 22,
    is_sold_out: false,
    variants: [
      { id: 213, product_id: 8, size: 'S', color: 'Light Grey', color_code: '#D3D3D3', stock: 6, available_stock: 6 },
      { id: 214, product_id: 8, size: 'M', color: 'Light Grey', color_code: '#D3D3D3', stock: 8, available_stock: 8 },
      { id: 215, product_id: 8, size: 'L', color: 'Light Grey', color_code: '#D3D3D3', stock: 5, available_stock: 5 },
      { id: 216, product_id: 8, size: 'XL', color: 'Light Grey', color_code: '#D3D3D3', stock: 3, available_stock: 3 }
    ]
  },

  // --------------------------------------------------------------------------
  // KOLEKSI 3: PICK ME COLLECTION
  // --------------------------------------------------------------------------
  {
    id: 9,
    collection_id: 3,
    collection_name: 'Pick Me Collection',
    collection_slug: 'pickme-collection',
    name: 'Pick me Art Enpidi',
    slug: 'npd-thermal-sherpa-fleece-jacket',
    description: 'High-pile bonded thermal sherpa jacket with contrast taslan storm collar and zip chest panel. Engineered to trap maximum body warmth while maintaining a boxy cut.',
    price: 350000,
    original_price: 799000,
    is_featured: 1,
    images: [
      './products/IMG_1433.PNG',
      './products/modelpb.jpg'
    ],
    primary_image: './products/IMG_1433.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Pink', code: '#FF69B4' }],
    total_stock: 14,
    total_available_stock: 14,
    is_sold_out: false,
    variants: [
      { id: 301, product_id: 9, size: 'S', color: 'Pink', color_code: '#FF69B4', stock: 5, available_stock: 5 },
      { id: 302, product_id: 9, size: 'M', color: 'Pink', color_code: '#FF69B4', stock: 4, available_stock: 4 },
      { id: 303, product_id: 9, size: 'L', color: 'Pink', color_code: '#FF69B4', stock: 3, available_stock: 3 },
      { id: 304, product_id: 9, size: 'XL', color: 'Pink', color_code: '#FF69B4', stock: 2, available_stock: 2 }
    ]
  },
  {
    id: 10,
    collection_id: 3,
    collection_name: 'Pick Me Collection',
    collection_slug: 'pickme-collection',
    name: 'Pick Me Art Odlanorc',
    slug: 'npd-winter-tactical-puffer-coat',
    description: 'Down-alternative insulation with matte weatherproof micro-ripstop shell. Concealed storm flap, dual-way YKK zippers, fleece-lined handwarmer pockets.',
    price: 350000,
    original_price: 550000,
    is_featured: 1,
    images: [
      './products/IMG_1432.PNG',
      './products/modelmessi.webp'
    ],
    primary_image: './products/IMG_1432.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Green Army', code: '#4B5320' }],
    total_stock: 10,
    total_available_stock: 10,
    is_sold_out: false,
    variants: [
      { id: 305, product_id: 10, size: 'S', color: 'Green Army', color_code: '#4B5320', stock: 2, available_stock: 2 },
      { id: 306, product_id: 10, size: 'M', color: 'Green Army', color_code: '#4B5320', stock: 4, available_stock: 4 },
      { id: 307, product_id: 10, size: 'L', color: 'Green Army', color_code: '#4B5320', stock: 3, available_stock: 3 },
      { id: 308, product_id: 10, size: 'XL', color: 'Green Army', color_code: '#4B5320', stock: 1, available_stock: 1 }
    ]
  },
  {
    id: 11,
    collection_id: 3,
    collection_name: 'Pick Me Collection',
    collection_slug: 'pickme-collection',
    name: 'Pick Me art Tylor Durden',
    slug: 'npd-heavyweight-balaclava-hoodie',
    description: 'Special edition winter hoodie with integrated cross-collar face cover balaclava. 500 GSM loopback cotton fleece with thermal waffle lining.',
    price: 350000,
    original_price: 689000,
    is_featured: 0,
    images: [
      './products/IMG_1431.PNG',
      './products/modeloliv.webp'
    ],
    primary_image: './products/IMG_1431.PNG',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Dark Navy', code: '#1B2A4A' }],
    total_stock: 10,
    total_available_stock: 10,
    is_sold_out: false,
    variants: [
      { id: 309, product_id: 11, size: 'S', color: 'Dark Navy', color_code: '#1B2A4A', stock: 3, available_stock: 3 },
      { id: 310, product_id: 11, size: 'M', color: 'Dark Navy', color_code: '#1B2A4A', stock: 5, available_stock: 5 },
      { id: 311, product_id: 11, size: 'L', color: 'Dark Navy', color_code: '#1B2A4A', stock: 2, available_stock: 2 },
      { id: 312, product_id: 11, size: 'XL', color: 'Dark Navy', color_code: '#1B2A4A', stock: 0, available_stock: 0 }
    ]
  },
  {
    id: 12,
    collection_id: 3,
    collection_name: 'Pick Me Collection',
    collection_slug: 'pickme-collection',
    name: 'Pick Me Art YONMP (SOLD OUT DEMO)',
    slug: 'npd-arctic-beanie-glove-set',
    description: '100% Merino wool knit beanie and touchscreen-compatible thermal gloves. Completely sold out winter accessory bundle.',
    price: 189000,
    original_price: 229000,
    is_featured: 0,
    images: [
      './products/IMG_1427.PNG',
      './products/modelROc.webp'
    ],
    primary_image: './products/IMG_1427.PNG',
    sizes: ['ONE SIZE'],
    colors: [{ name: 'Light Grey', code: '#D3D3D3' }],
    total_stock: 0,
    total_available_stock: 0,
    is_sold_out: true,
    variants: [
      { id: 313, product_id: 12, size: 'ONE SIZE', color: 'Light Grey', color_code: '#D3D3D3', stock: 0, available_stock: 0 }
    ]
  }
];
