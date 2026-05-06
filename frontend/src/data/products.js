// Shop Config
export const WHATSAPP_NUMBER = '918979011405';
export const WHATSAPP_MSG = encodeURIComponent("Hi! I'd like to place an order from BouquetOfLove 🌸");
export const GPAY_UPI = 'mehulagarwal1313-1@okaxis';
export const SHOP_NAME = 'BouquetOfLove';
export const INSTAGRAM = 'https://instagram.com/bouquetoflove44';

export const products = [
  {
    id: 'flower-bouquet',
    name: 'Flower Bouquet',
    category: 'bouquets',
    tagline: 'Fresh blooms, crafted with love',
    startingPrice: 199,
    images: ['/images/product1.jpg', '/images/product2.jpg'],
    description: 'Beautiful handcrafted flower bouquets made fresh to order. Choose from roses, mixed seasonal flowers, and more — perfect for every occasion.',
    badge: 'Bestseller',
    options: {
      types: [
        { id: 'roses', label: 'Red Roses', price: 299 },
        { id: 'mixed', label: 'Mixed Flowers', price: 249 },
        { id: 'seasonal', label: 'Seasonal Blooms', price: 199 },
        { id: 'sunflowers', label: 'Sunflowers', price: 349 },
        { id: 'lilies', label: 'Lilies', price: 399 },
      ],
      sizes: [
        { id: 'small', label: 'Small (8-10 stems)', multiplier: 1 },
        { id: 'medium', label: 'Medium (15-20 stems)', multiplier: 1.6 },
        { id: 'large', label: 'Large (25-30 stems)', multiplier: 2.4 },
      ],
    },
  },
  {
    id: 'chocolate-bouquet',
    name: 'Chocolate Bouquet',
    category: 'bouquets',
    tagline: 'Sweet treats, beautifully arranged',
    startingPrice: 100,
    images: ['/images/product3.jpg', '/images/product4.jpg'],
    description: 'Stunning bouquets crafted from premium chocolates. Choose your chocolate tier and wrapping style for a truly indulgent gift.',
    badge: 'Popular',
    options: {
      tiers: [
        { id: 'basic', label: 'Basic (Dairy Milk, Gems)', price: 150 },
        { id: 'standard', label: 'Standard (KitKat, Perk, 5Star)', price: 300 },
        { id: 'premium', label: 'Premium (Ferrero, Lindt)', price: 550 },
      ],
      wrapping: [
        { id: 'smooth', label: 'Smooth / High-Quality Sheet', price: 20 },
        { id: 'basic', label: 'Basic Sheet', price: 10 },
      ],
    },
  },
  {
    id: 'photo-frame',
    name: 'Handmade Photo Frame',
    category: 'frames',
    tagline: 'Memories, framed beautifully',
    startingPrice: 399,
    images: ['/images/product5.jpg', '/images/product6.jpg'],
    description: 'Handcrafted photo frames with mat-finished moulding. Fits 6 to 10+ photos. Perfect anniversary, birthday, or memory gift.',
    badge: 'Handcrafted',
    options: {
      sizes: [
        { id: 'a3', label: 'A3 (Standard)', basePrice: 399 },
        { id: 'a2', label: 'A2 (Large)', basePrice: 599 },
        { id: 'custom', label: 'Custom Size', basePrice: 699 },
      ],
      mouldingColors: ['Natural Wood', 'Matte Black', 'Rose Gold', 'White'],
      photoSheetPrice: 50,
      photosPerSheet: 6,
    },
  },
  {
    id: 'handmade-card',
    name: 'Handmade Card',
    category: 'cards',
    tagline: 'Words & photos, from the heart',
    startingPrice: 299,
    images: ['/images/product7.jpg', '/images/product8.jpg'],
    description: 'Fully customisable handmade greeting cards with unlimited photos and a personal message. Made from premium materials.',
    badge: 'Customisable',
    options: {
      materials: [
        { id: 'canvas', label: 'Canvas Sheet', price: 349 },
        { id: 'chart', label: 'Chart Paper', price: 299 },
        { id: 'a3', label: 'A3 Sheet', price: 329 },
        { id: 'a4', label: 'A4 Sheet', price: 299 },
      ],
    },
  },
  {
    id: 'embroidered-hanky',
    name: 'Embroidered Hanky',
    category: 'hanky',
    tagline: 'Pure cotton, stitched with care',
    startingPrice: 299,
    images: ['/images/product9.jpg', '/images/product10.jpg'],
    description: 'Premium pure-cotton handkerchiefs with custom embroidery. Choose a sample design or describe your own — for him or for her.',
    badge: 'Premium',
    options: {
      gender: ['For Her', 'For Him'],
      designs: [
        { id: 'd1', label: 'Floral Pattern', price: 299 },
        { id: 'd2', label: 'Name / Initials', price: 349 },
        { id: 'd3', label: 'Heart & Flowers', price: 329 },
        { id: 'd4', label: 'Custom Design', price: 399 },
      ],
    },
  },
  {
    id: 'cab-booking',
    name: 'Cab Booking',
    category: 'services',
    tagline: 'Reliable rides, just a tap away',
    startingPrice: 0,
    images: ['/images/product11.jpg', '/images/product12.jpg'],
    description: "Book a reliable cab through us. Fill in your pickup & drop details and we'll confirm your ride via WhatsApp.",
    badge: 'Service',
    options: {},
  },
];

export const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'frames', label: 'Photo Frames' },
  { id: 'cards', label: 'Cards' },
  { id: 'hanky', label: 'Hankies' },
  { id: 'services', label: 'Services' },
];

export const getProductById = (id) => products.find((p) => p.id === id);
