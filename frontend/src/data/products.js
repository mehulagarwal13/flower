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
    description: 'Beautiful handcrafted flower bouquets made fresh to order. Any type of available flowers - roses, mixed seasonal flowers, sunflowers, lilies, and more. Perfect for every occasion.',
    badge: 'Bestseller',
    options: {
      types: [
        { id: 'roses', label: 'Red Roses', price: 299 },
        { id: 'mixed', label: 'Mixed Seasonal Flowers', price: 249 },
        { id: 'seasonal', label: 'Seasonal Blooms', price: 199 },
        { id: 'sunflowers', label: 'Sunflowers', price: 349 },
        { id: 'lilies', label: 'Lilies', price: 399 },
        { id: 'gerberas', label: 'Gerberas', price: 279 },
        { id: 'orchids', label: 'Orchids', price: 449 },
        { id: 'carnations', label: 'Carnations', price: 229 },
      ],
      sizes: [
        { id: 'small', label: 'Small (8-10 stems)', multiplier: 1 },
        { id: 'medium', label: 'Medium (15-20 stems)', multiplier: 1.6 },
        { id: 'large', label: 'Large (25-30 stems)', multiplier: 2.4 },
        { id: 'premium', label: 'Premium (35-40 stems)', multiplier: 3.2 },
      ],
      addOns: [
        { id: 'chocolates', label: 'Add Chocolates', price: 75 },
        { id: 'teddy', label: 'Add Small Teddy', price: 120 },
        { id: 'card', label: 'Message Card', price: 15 },
        { id: 'premium-wrap', label: 'Premium Wrapping', price: 25 },
      ]
    },
  },
  {
    id: 'chocolate-bouquet',
    name: 'Chocolate Bouquet',
    category: 'bouquets',
    tagline: 'Sweet treats, beautifully arranged',
    startingPrice: 100,
    images: ['/images/product3.png', '/images/product3.png'],
    description: 'Stunning bouquets crafted from premium chocolates. Prices vary from ₹100 to ₹600 based on your chocolate choices. High-quality smooth wrapping sheet (₹20) or basic sheet (₹10) available.',
    badge: 'Popular',
    options: {
      brands: [
        { id: 'dairy-milk', label: 'Dairy Milk Silk', price: 30 },
        { id: 'kitkat', label: 'KitKat', price: 25 },
        { id: '5star', label: '5 Star', price: 15 },
        { id: 'perk', label: 'Perk', price: 10 },
        { id: 'munch', label: 'Munch', price: 10 },
        { id: 'ferrero', label: 'Ferrero Rocher', price: 80 },
        { id: 'lindt', label: 'Lindt Lindor', price: 150 },
        { id: 'cadbury', label: 'Cadbury Celebrations', price: 45 },
        { id: 'toblerone', label: 'Toblerone', price: 65 },
      ],
      wrapping: [
        { id: 'smooth', label: 'High-Quality Smooth Sheet', price: 20 },
        { id: 'basic', label: 'Basic Sheet', price: 10 },
      ],
      baseCost: 80, // Base cost for stick, foam, and decoration
      addOns: [
        { id: 'flowers', label: 'Add Fresh Flowers', price: 50 },
        { id: 'ribbon', label: 'Premium Ribbon', price: 15 },
        { id: 'card', label: 'Message Card', price: 10 },
      ]
    },
  },
  {
    id: 'photo-frame',
    name: 'Handmade Photo Frame',
    category: 'frames',
    tagline: 'Memories, framed beautifully',
    startingPrice: 399,
    images: ['/images/product5.png', '/images/product5.png'],
    description: 'Handcrafted photo frames with mat-finished moulding. Sample shown costs ₹399 for A3 size. One sheet contains 6 photos costing ₹50 including other pasting stuff. Price varies according to photos and size. Frame contains 10+ photos or as per your choice.',
    badge: 'Handcrafted',
    options: {
      sizes: [
        { id: 'a3', label: 'A3 Size', basePrice: 399 },
        { id: 'a4', label: 'A4 Size', basePrice: 249 },
        { id: 'custom', label: 'Custom Size', basePrice: 499 },
      ],
      mouldingColors: ['Natural Wood', 'Matte Black', 'Rose Gold', 'White', 'Matte Finished Side'],
      photoSheetPrice: 50,
      photosPerSheet: 6,
      otherPastingStuff: 20,
    },
  },
  {
    id: 'handmade-card',
    name: 'Handmade Card',
    category: 'cards',
    tagline: 'Words & photos, from the heart',
    startingPrice: 299,
    images: ['/images/product7.png', '/images/product7.png'],
    description: 'Made with all efforts and love, containing infinite photos as per your choices. According to given samples, prices are ₹299 but may vary based on materials and stuff used. Using canvas sheet, chart papers, A3 or A4 size sheets. Cards contain notes that you can provide.',
    badge: 'Customisable',
    options: {
      materials: [
        { id: 'canvas', label: 'Canvas Sheet', price: 349 },
        { id: 'chart', label: 'Chart Papers', price: 299 },
        { id: 'a3', label: 'A3 Size Sheet', price: 329 },
        { id: 'a4', label: 'A4 Size Sheet', price: 299 },
      ],
    },
  },
  {
    id: 'embroidered-hanky',
    name: 'Embroidered Hanky',
    category: 'hanky',
    tagline: 'Pure cotton, stitched with care',
    startingPrice: 299,
    images: ['/images/product9.png', '/images/product9.png'],
    description: 'Prices depend on inspiration and your suggestions. Given sample costs ₹299 because it contains pure love and hard work. Best quality hanky with pure cotton cloth. Available for both female and males. Custom embroidery designs available.',
    badge: 'Premium',
    options: {
      gender: ['Female', 'Male'],
      cloth: 'Pure Cotton',
      designs: [
        { id: 'd1', label: 'Floral Pattern', price: 299 },
        { id: 'd2', label: 'Name / Initials', price: 349 },
        { id: 'custom', label: 'Custom Inspiration', price: 399 },
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
