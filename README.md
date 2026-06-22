# CodeVector — MERN Stack Product Dashboard

> A production-ready MERN Stack application featuring **cursor-based pagination** over **200,000 products** in MongoDB Atlas.

![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📁 Project Structure

```
CodeVector-Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   └── productController.js  # Business logic
│   │   ├── models/
│   │   │   └── Product.js            # Mongoose schema + indexes
│   │   ├── routes/
│   │   │   └── productRoutes.js      # API route definitions
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Global error handler
│   │   │   └── validate.js           # Query param validation
│   │   ├── utils/
│   │   │   └── cursorHelper.js       # Cursor pagination utilities
│   │   └── server.js                 # Express app entry point
│   ├── seed/
│   │   └── seedProducts.js           # 200k product generator
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── CategoryFilter.jsx
    │   │   ├── LoadMoreButton.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── ErrorState.jsx
    │   │   └── StatsBar.jsx
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── productService.js     # Axios API client
    │   ├── hooks/
    │   │   └── useProducts.js        # Custom pagination hook
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css                 # Tailwind + custom styles
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account

### 1. Clone and navigate
```bash
git clone <your-repo>
cd CodeVector-Assignment
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env (already set with your MongoDB URI)
npm run dev
```

### 3. Seed the Database (200k products)
```bash
cd backend
npm run seed
# Takes ~2–3 minutes — progress shown in terminal
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🗄️ MongoDB Schema

```javascript
// Product Schema
{
  _id:       ObjectId,    // Auto-generated MongoDB ObjectId
  name:      String,      // Product name (2–200 chars, required)
  category:  String,      // One of 7 categories (enum, required)
  price:     Number,      // Price in USD (≥ 0, 2 decimal precision)
  createdAt: Date,        // Auto-managed by Mongoose timestamps
  updatedAt: Date,        // Auto-managed by Mongoose timestamps
}

// Compound Indexes
{ createdAt: -1, _id: -1 }              // General pagination
{ category: 1, createdAt: -1, _id: -1 } // Category-filtered pagination
```

### Categories
`Electronics` | `Books` | `Fashion` | `Sports` | `Home` | `Beauty` | `Grocery`

---

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-render-app.onrender.com/api`

---

### `GET /api/products`

Fetch a paginated list of products sorted by newest first.

#### Query Parameters

| Parameter        | Type   | Default | Description                                      |
|-----------------|--------|---------|--------------------------------------------------|
| `limit`          | number | 20      | Products per page (max: 100)                     |
| `category`       | string | All     | Filter: Electronics, Books, Fashion, Sports, etc |
| `cursorCreatedAt`| string | —       | ISO date string of the last product seen         |
| `cursorId`       | string | —       | ObjectId of the last product seen                |

> `cursorCreatedAt` and `cursorId` must always be provided **together**.

#### Example Requests

**First page (no cursor):**
```
GET /api/products?limit=20
GET /api/products?limit=20&category=Electronics
```

**Next page (with cursor):**
```
GET /api/products?limit=20&cursorCreatedAt=2026-06-01T10:30:00.000Z&cursorId=6676ab12ef34c12345678901
```

#### Response Format
```json
{
  "success": true,
  "products": [
    {
      "_id": "6676ab12ef34c12345678901",
      "name": "Premium Wireless Headphones XYZ4",
      "category": "Electronics",
      "price": 149.99,
      "createdAt": "2026-06-22T10:30:00.000Z",
      "updatedAt": "2026-06-22T10:30:00.000Z"
    }
  ],
  "nextCursor": {
    "createdAt": "2026-06-01T08:15:00.000Z",
    "id": "6676ab12ef34c12345678920"
  },
  "count": 20
}
```

> `nextCursor` is `null` when there are no more pages.

---

### `GET /api/products/categories`

Returns the list of valid product categories.

```json
{
  "success": true,
  "categories": ["Electronics", "Books", "Fashion", "Sports", "Home", "Beauty", "Grocery"]
}
```

---

### `GET /api/products/stats`

Returns total product count and breakdown by category.

```json
{
  "success": true,
  "totalProducts": 200000,
  "byCategory": [
    { "_id": "Beauty",      "count": 28532 },
    { "_id": "Books",       "count": 29104 },
    { "_id": "Electronics", "count": 28861 }
  ]
}
```

---

### `GET /api/health`

Health check endpoint.

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-06-22T10:30:00.000Z",
  "uptime": "3600s"
}
```

---

## 📖 Cursor Pagination — Explained

### The Problem with Skip/Limit

Traditional offset pagination works like:
```js
// Page 1
db.products.find({}).skip(0).limit(20)
// Page 2
db.products.find({}).skip(20).limit(20)
```

**Issues:**
1. **Performance degrades** — MongoDB must scan and discard `skip` documents. At page 100 with limit 20: it scans 2,000 docs just to skip them. At 200k records this becomes catastrophic.
2. **Duplicates appear** — If a new product is inserted at position 5, every item shifts down. Item at position 20 is now at 21 — the user sees it again on page 2.
3. **Products are missed** — Conversely, if a product is deleted, items shift up and one product is skipped.

### The Cursor Solution

Instead of "skip N records", we say **"give me records older than this one"**:

```js
// First page (no cursor)
db.products
  .find({})
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)

// Next page (cursor from last item of previous page)
db.products
  .find({
    $or: [
      { createdAt: { $lt: lastSeenDate } },          // Older timestamp
      { createdAt: lastSeenDate, _id: { $lt: lastSeenId } }  // Same timestamp, lower _id
    ]
  })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
```

### Why It Prevents Duplicates & Missing Records

```
Timeline: User browsing page 1 → page 2

Page 1 result: [P20, P19, P18, ... P1]
Cursor stored: { createdAt: P1.createdAt, id: P1._id }

[New product P21 inserted by someone else]

Page 2 query: "Give me products OLDER than P1"
Result: [P-1, P-2, ... P-20]

✅ P21 is newer than P1, so it's excluded from page 2
✅ No items shifted from our cursor point downward
✅ Zero duplicates, zero missed records
```

### Why the Compound (createdAt, _id) Key?

- `createdAt` alone is **not unique** — two products can be inserted at the same millisecond
- Adding `_id` as a **tiebreaker** makes the sort key **globally unique**
- MongoDB ObjectIds are monotonically increasing within the same second, providing a natural secondary sort

---

## ⚡ MongoDB Indexing — Explained

### Index 1: `{ createdAt: -1, _id: -1 }`

Used when **no category filter** is applied. MongoDB can:
1. Enter the index at the cursor position in O(log n) time
2. Scan forward linearly — no full collection scan needed

### Index 2: `{ category: 1, createdAt: -1, _id: -1 }`

Used when a **category filter** is applied. The `category` prefix allows:
1. Direct jump to the category sub-tree in the index (equality match)
2. Then cursor navigation within that category in sorted order

**Without indexes:** MongoDB performs a full collection scan (COLLSCAN) — reads all 200,000 documents to find 20.  
**With indexes:** MongoDB performs an index scan (IXSCAN) — reads ~20 index entries and retrieves exactly those documents.

Performance difference at 200k records:
| Method | Operation | Time |
|--------|-----------|------|
| No index (COLLSCAN) | ~200,000 reads | ~800ms |
| With index (IXSCAN) | ~20 reads | ~5ms |

---

## 🚢 Deployment Guide

### Database → MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` for IP access (or specific IPs)
4. Copy the connection string

### Backend → Render
1. Push your `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set **Root Directory** to `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   PORT=5000
   ```
8. Deploy → copy the URL (e.g. `https://codevector-api.onrender.com`)

### Frontend → Vercel
1. Push your `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Connect your GitHub repo
4. Set **Root Directory** to `frontend`
5. Set **Framework Preset**: Vite
6. Add Environment Variable:
   ```
   VITE_API_URL=https://codevector-api.onrender.com
   ```
7. Deploy → open the live URL

---

## 🎓 Interview Notes

### 1. Why is cursor pagination better than skip/limit?

| Aspect | Skip/Limit | Cursor Pagination |
|--------|-----------|-------------------|
| Performance at page 1000 | Scans 20,000 docs | Always scans ~20 docs |
| Duplicates on new inserts | ✅ Can happen | ❌ Never |
| Missed records on delete | ✅ Can happen | ❌ Never |
| Consistent results | ❌ No | ✅ Yes |
| Index utilization | Poor (full scan) | Excellent (point lookup) |

### 2. How does indexing improve performance?

A MongoDB index is a B-tree data structure. When you query `{ category: "Electronics", createdAt: { $lt: date } }`:

- **Without index:** Full collection scan → reads all 200k documents → ~800ms
- **With index:** B-tree binary search → jumps directly to the matching range → ~5ms

The compound index `{ category: 1, createdAt: -1, _id: -1 }` satisfies both the filter (equality on category) and the sort (range on createdAt, tiebreak on _id) in a single index scan.

### 3. How does MongoDB handle 200,000 records efficiently?

- **Compound indexes** eliminate full collection scans
- **`.lean()`** returns plain JS objects instead of full Mongoose documents (2–3× faster)
- **`insertMany` bulk writes** in the seed script achieve ~15,000 docs/sec
- **`estimatedDocumentCount()`** uses collection metadata instead of scanning
- **WiredTiger storage engine** compresses data and manages memory (RAM cache) automatically

### 4. What improvements could be made with more time?

- **Search:** Full-text search on product names using MongoDB Atlas Search
- **Caching:** Redis layer to cache frequent category queries
- **Real-time:** WebSocket updates when new products arrive
- **Auth:** JWT-based user accounts with saved filters/wishlists
- **Analytics:** Aggregation pipelines for price histograms, category distributions
- **Testing:** Jest unit tests for controllers, Supertest integration tests for routes
- **Rate limiting:** express-rate-limit to prevent API abuse
- **Pagination UX:** Infinite scroll using Intersection Observer API

### 5. Common Interview Questions

**Q: What happens when two products have the same `createdAt` timestamp?**
A: The compound sort key `(createdAt, _id)` handles this. `_id` (ObjectId) is globally unique, so the tiebreaker ensures stable ordering.

**Q: What if a user filters by category mid-browsing?**
A: The `useProducts` hook resets the cursor to `null` on category change, clearing products and fetching a fresh first page.

**Q: Could you use `_id` alone as the cursor?**
A: ObjectIds encode a timestamp with 1-second precision. If two products are inserted in the same second, their order by `_id` alone would be non-deterministic across replica set members. `createdAt` + `_id` is more reliable.

**Q: Why use `@faker-js/faker` for seed data instead of random strings?**
A: Faker generates realistic product names (not just `product_abc123`), making the UI look production-ready and making it easier to validate that categories/names look right.

**Q: How would you handle 10 million records?**
A: Same cursor pagination strategy — performance doesn't degrade because the index lookup is always O(log n). Would add sharding by category for horizontal scaling.

---

## 🛠️ Tech Stack

| Layer    | Technology       | Purpose                              |
|----------|-----------------|--------------------------------------|
| Database | MongoDB Atlas    | 200k document storage + indexing     |
| ORM      | Mongoose 8       | Schema, validation, query building   |
| Backend  | Express.js 4     | REST API server                      |
| Runtime  | Node.js 18+      | JavaScript runtime                   |
| Frontend | React 18 + Vite  | UI framework                         |
| Styling  | Tailwind CSS 3   | Utility-first CSS                    |
| HTTP     | Axios            | API communication                    |
| Icons    | lucide-react     | Icon library                         |
| Seed     | @faker-js/faker  | Realistic test data generation       |

---

*Built for the CodeVector Internship Assignment — June 2026*
