/**
 * Product Seed Script
 * ───────────────────────────────────────────────────────────────────────────
 * Generates and inserts 200,000 product documents into MongoDB Atlas.
 *
 * Strategy:
 *   - Uses @faker-js/faker for realistic product names
 *   - Inserts in batches of 5,000 using insertMany (bulk write)
 *   - Spreads createdAt timestamps over the past 2 years for realistic data
 *   - Provides real-time progress logging
 *
 * Usage:
 *   npm run seed
 *   (or: node seed/seedProducts.js)
 *
 * ⚠️  WARNING: This will DROP and recreate the products collection.
 *     All existing products will be deleted. Run only once.
 */

require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// ── Configuration ────────────────────────────────────────────────────────────
const TOTAL_PRODUCTS = 200_000;
const BATCH_SIZE = 5_000;
const TOTAL_BATCHES = TOTAL_PRODUCTS / BATCH_SIZE;

// Valid categories matching the Product model
const CATEGORIES = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Home",
  "Beauty",
  "Grocery",
];

// Product name templates per category for realistic names
const PRODUCT_PREFIXES = {
  Electronics: [
    "Wireless", "Smart", "Pro", "Ultra", "Bluetooth", "4K", "HD", "Digital",
    "Portable", "Premium", "Advanced", "Mini", "Compact", "Turbo",
  ],
  Books: [
    "The Art of", "Mastering", "Introduction to", "Complete Guide to",
    "Learning", "Advanced", "Fundamentals of", "Secrets of", "The Science of",
  ],
  Fashion: [
    "Classic", "Slim Fit", "Premium", "Vintage", "Modern", "Casual",
    "Formal", "Urban", "Athletic", "Luxury", "Designer",
  ],
  Sports: [
    "Pro", "Elite", "Training", "Performance", "Competition", "Ultra",
    "Sport", "Power", "Speed", "Endurance", "Professional",
  ],
  Home: [
    "Modern", "Luxury", "Smart", "Compact", "Ergonomic", "Premium",
    "Eco-Friendly", "Multi-Purpose", "Portable", "Heavy-Duty",
  ],
  Beauty: [
    "Organic", "Natural", "Premium", "Advanced", "Hydrating", "Revitalizing",
    "Anti-Aging", "Brightening", "Nourishing", "Pure",
  ],
  Grocery: [
    "Organic", "Fresh", "Natural", "Premium", "Whole", "Low-Fat",
    "Sugar-Free", "Gluten-Free", "Farm Fresh", "Pure",
  ],
};

const PRODUCT_ITEMS = {
  Electronics: [
    "Headphones", "Speaker", "Laptop", "Tablet", "Smartwatch", "Earbuds",
    "Monitor", "Keyboard", "Mouse", "Webcam", "Charger", "Power Bank",
    "Router", "Drone", "Camera", "TV Remote", "Smart Bulb", "USB Hub",
  ],
  Books: [
    "JavaScript", "Python Programming", "Data Structures", "Machine Learning",
    "System Design", "Clean Code", "Leadership", "Personal Finance",
    "History", "Philosophy", "Science Fiction", "Mystery Novel",
  ],
  Fashion: [
    "T-Shirt", "Jeans", "Hoodie", "Jacket", "Sneakers", "Dress",
    "Shirt", "Trousers", "Blazer", "Shorts", "Skirt", "Boots", "Sandals",
  ],
  Sports: [
    "Running Shoes", "Yoga Mat", "Dumbbell Set", "Resistance Bands",
    "Water Bottle", "Gym Gloves", "Jump Rope", "Cycling Helmet",
    "Tennis Racket", "Football", "Basketball", "Swimming Goggles",
  ],
  Home: [
    "Desk Lamp", "Air Purifier", "Coffee Maker", "Blender", "Toaster",
    "Vacuum Cleaner", "Curtains", "Bed Sheets", "Storage Box",
    "Wall Clock", "Scented Candle", "Throw Pillow",
  ],
  Beauty: [
    "Face Serum", "Moisturizer", "Shampoo", "Conditioner", "Lip Balm",
    "Foundation", "Mascara", "Sunscreen SPF50", "Eye Cream",
    "Body Lotion", "Face Wash", "Toner",
  ],
  Grocery: [
    "Olive Oil", "Honey", "Green Tea", "Protein Bars", "Almond Milk",
    "Oats", "Brown Rice", "Quinoa", "Dark Chocolate", "Coconut Oil",
    "Mixed Nuts", "Dried Fruits",
  ],
};

/**
 * Generate a single product document
 * Uses random timestamp spread across the past 2 years for realistic data
 *
 * @param {number} index - Used to spread timestamps evenly
 * @returns {object} Product document ready for MongoDB insertion
 */
const generateProduct = (index) => {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const prefixes = PRODUCT_PREFIXES[category];
  const items = PRODUCT_ITEMS[category];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  const suffix = Math.random() > 0.5 ? ` ${faker.string.alphanumeric(4).toUpperCase()}` : "";
  const name = `${prefix} ${item}${suffix}`;

  // Spread createdAt over past 730 days (2 years) for realistic dataset
  // Using index to ensure variety rather than pure random (which clusters)
  const daysAgo = Math.floor((index / TOTAL_PRODUCTS) * 730);
  const hoursVariance = Math.floor(Math.random() * 24);
  const minutesVariance = Math.floor(Math.random() * 60);

  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  createdAt.setHours(createdAt.getHours() - hoursVariance);
  createdAt.setMinutes(createdAt.getMinutes() - minutesVariance);

  // Price range varies by category for realism
  const priceRanges = {
    Electronics: { min: 9.99, max: 2999.99 },
    Books:       { min: 4.99, max: 89.99 },
    Fashion:     { min: 9.99, max: 499.99 },
    Sports:      { min: 4.99, max: 599.99 },
    Home:        { min: 4.99, max: 999.99 },
    Beauty:      { min: 3.99, max: 199.99 },
    Grocery:     { min: 0.99, max: 79.99 },
  };

  const range = priceRanges[category];
  const price = parseFloat(
    (Math.random() * (range.max - range.min) + range.min).toFixed(2)
  );

  return {
    name,
    category,
    price,
    createdAt,
    updatedAt: createdAt,
  };
};

/**
 * Main seed function
 * Connects to MongoDB, drops existing collection, and inserts 200,000 products
 */
const seedProducts = async () => {
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  CodeVector — Product Database Seed Script");
  console.log("═══════════════════════════════════════════════════\n");

  // ── Connect to MongoDB ──────────────────────────────────────────────────────
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected to MongoDB Atlas\n`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }

  // ── Get the Product model (inline schema for seed script) ───────────────────
  // We define a minimal schema here to avoid circular dependency issues
  const productSchema = new mongoose.Schema(
    {
      name: String,
      category: String,
      price: Number,
      createdAt: Date,
      updatedAt: Date,
    },
    { timestamps: false, versionKey: false }
  );

  // Use existing model if already registered (e.g., when re-running)
  const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

  // ── Drop existing collection ────────────────────────────────────────────────
  try {
    await Product.collection.drop();
    console.log("🗑️  Dropped existing products collection\n");
  } catch (err) {
    // Collection may not exist yet — that's fine
    if (err.code !== 26) {
      console.log("ℹ️  No existing collection to drop (starting fresh)\n");
    }
  }

  // ── Seed Products in Batches ────────────────────────────────────────────────
  console.log(`📦 Inserting ${TOTAL_PRODUCTS.toLocaleString()} products`);
  console.log(`   Batch size: ${BATCH_SIZE.toLocaleString()}`);
  console.log(`   Total batches: ${TOTAL_BATCHES}\n`);

  const startTime = Date.now();
  let totalInserted = 0;

  for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
    const batchStartIndex = batch * BATCH_SIZE;

    // Generate a batch of products
    const products = Array.from({ length: BATCH_SIZE }, (_, i) =>
      generateProduct(batchStartIndex + i)
    );

    // Bulk insert — much faster than individual saves
    await Product.collection.insertMany(products, { ordered: false });

    totalInserted += BATCH_SIZE;

    // Progress update every 10 batches
    const percent = ((batch + 1) / TOTAL_BATCHES * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const docsPerSec = Math.round(totalInserted / (Date.now() - startTime) * 1000);

    process.stdout.write(
      `\r   Batch ${(batch + 1).toString().padStart(2)}/${TOTAL_BATCHES} | ` +
      `${totalInserted.toLocaleString().padStart(7)} products | ` +
      `${percent}% | ${elapsed}s | ${docsPerSec.toLocaleString()} docs/sec`
    );
  }

  console.log("\n");

  // ── Create Indexes ──────────────────────────────────────────────────────────
  console.log("🔍 Creating indexes...");

  await Product.collection.createIndex(
    { createdAt: -1, _id: -1 },
    { name: "idx_createdAt_id_desc" }
  );
  console.log("   ✅ Index: { createdAt: -1, _id: -1 }");

  await Product.collection.createIndex(
    { category: 1, createdAt: -1, _id: -1 },
    { name: "idx_category_createdAt_id" }
  );
  console.log("   ✅ Index: { category: 1, createdAt: -1, _id: -1 }\n");

  // ── Verify Insertion ────────────────────────────────────────────────────────
  const finalCount = await Product.collection.countDocuments();
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("═══════════════════════════════════════════════════");
  console.log(`✅ Seed Complete!`);
  console.log(`   Total products: ${finalCount.toLocaleString()}`);
  console.log(`   Time taken:     ${totalTime}s`);
  console.log(`   Avg speed:      ${Math.round(finalCount / totalTime).toLocaleString()} docs/sec`);
  console.log("═══════════════════════════════════════════════════\n");

  // ── Category breakdown ──────────────────────────────────────────────────────
  const breakdown = await Product.collection
    .aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  console.log("📊 Category Breakdown:");
  breakdown.forEach(({ _id, count }) => {
    console.log(`   ${_id.padEnd(12)}: ${count.toLocaleString()}`);
  });

  console.log("\n🎉 Database is ready! Run: npm run dev\n");

  await mongoose.disconnect();
  process.exit(0);
};

// ── Run ──────────────────────────────────────────────────────────────────────
seedProducts().catch((error) => {
  console.error("\n❌ Seed failed:", error.message);
  mongoose.disconnect();
  process.exit(1);
});
