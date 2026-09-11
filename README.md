# WEAR OUT — Streetwear E-Commerce (Full-Stack)

A production-grade full-stack e-commerce site for the **Wear Out** streetwear brand.
Built with **React (Vite) + TailwindCSS** on the frontend and **Node.js + Express + MongoDB (Mongoose)** on the backend.

> **Purpose of this file:** This README is written so that any AI assistant (or future you) can read it, understand the
> current state of the project, and safely continue editing. Read the "How to resume / edit" section at the bottom first.

---

## 1. Current Project State (as of last update)

- **Live site:** `https://wearout.shop` (Netlify) + `https://wear-out.onrender.com` (Render backend)
- **Public site (light theme):** Home (scroll hero + featured products grid), Category pages (Shirts, Trousers, Caps, Shoes, Watches, Accessories, Un Stitch), Product Detail (with carousel + shoe size table), Cart, Checkout, About, Contact, Search.
- **Hero:** A scroll-driven "WEAR OUT" wordmark (`BrandHero.jsx`) with tagline + buttons that fade in on a 1.8s timer.
- **Logo:** `frontend/public/assets/logo.webp` (compressed) shown in the navbar and footer. Also the favicon.
- **Products:** name, description, price, multiple sizes, category, `images[]` (multi-image carousel), `featured` (bool), `rating` (0–5), `gender` (Male/Female/Unisex), `stock` (Number, default 0), `shopkeeper` (ref), `shopName`, `featuredPending`.
- **Multi-image carousel:** Products display images in a swipeable carousel with arrow buttons + dots (`ProductCarousel.jsx`).
- **Stock tracking:** Admin and seller set `stock` count. Orders decrement stock. Product detail shows stock badge.
- **Shoe orders:** Require phone number (`shoePhone` field). Shoe size conversion table (US/UK/PK-EU) shown on product detail.
- **Quantity selector:** Product detail page has +/- quantity before Add to Cart.
- **Gender filter:** Unstitched page and category pages support `?gender=Male|Female|Unisex`.
- **Homepage "DROP 001" section** shows only `featured: true` products. Featured images grid (20 images max) auto-scrolls to hero buttons.
- **Multi-Vendor System:** Shopkeepers can sign up, get admin approval, manage their own products/orders/analytics/customers via a separate panel with mobile bottom navigation.
- **Admin panel (light theme):** Products CRUD (multi-image upload), Orders (with quantity + shoePhone + one-click copy), Customers, Reviews moderation, Courier Hub, Analytics (lazy-loaded), Logistics AI (lazy-loaded), Shopkeeper management, Featured Requests management. The "Admin" link is hidden from public unless authenticated.
- **Search:** Global search bar in navbar navigates to `/search?q=...`.
- **SEO:** Meta description, Open Graph, Twitter Card, canonical URL, JSON-LD (Organization + WebSite + Product schema). Dynamic product JSON-LD on ProductDetail.
- **Performance:** Admin Analytics + Logistics lazy-loaded via `React.lazy`. Skeleton loading on homepage. Logo/hero images compressed to WebP. Preload hints for hero + logo. Cloudinary URL auto-optimization (`f_auto,q_auto,w_600`).
- **Mobile:** Fully responsive. Shopkeeper panel has bottom nav on mobile. Admin tables have horizontal scroll.

### Known limitations / deliberate decisions
- Cloudinary free tier: 25GB storage + 25GB bandwidth/month.
- Render free tier: sleeps when idle (cold start). MongoDB Atlas free M0.
- Hostinger DNS: A record `@ → 75.2.60.5`, CNAME `www → wear-out.netlify.app`.

---

## 2. Tech Stack / Libraries

### Frontend (`frontend/`)
| Purpose | Library |
|---------|---------|
| Framework / build | React 18 + Vite |
| Styling | TailwindCSS (custom theme colors: `mist`, `bone`, `gold`, `gold-light`, `ink`, `slate`) |
| Animation | Framer Motion (hero scroll effects) |
| Charts (admin) | Recharts (lazy-loaded) |
| Routing | React Router v6 |
| HTTP | Axios (instance in `src/api.js`, baseURL `/api`, attaches admin/seller JWT) |
| Fonts | Bebas Neue (`font-display`), Inter (`font-body`), **Orbitron** (hero wordmark) |

### Backend (`backend/`)
| Purpose | Library |
|---------|---------|
| Server | Express |
| ODM | Mongoose |
| Auth | `jsonwebtoken` (JWT) + `bcryptjs` |
| Uploads | `multer` (memoryStorage) + `cloudinary` (direct stream upload) |
| Security | `helmet`, `express-rate-limit`, `sanitize-html` |

### Database
- MongoDB (Atlas in production). Models: `Product`, `Order`, `Review`, `Admin`, `Courier`, `Shopkeeper`.

---

## 3. How to Run (local development)

You need **two servers running at once**: the backend (port 5000) and the frontend (port 5173).

### Step A — Start backend (port 5000)
```bash
cd backend
npm install
cp .env.example .env     # if missing
npm run dev              # nodemon; seeds admin + couriers on first boot
```
API: `http://localhost:5000`. Health check: `GET /api/health`.

### Step B — Start frontend (port 5173)
```bash
cd frontend
npm install
npm run dev              # Vite dev server
```
Site: `http://localhost:5173`. Vite proxies `/api` → `http://localhost:5000`.

---

## 4. Project Structure Map

### `frontend/src/`
| Path | Responsibility |
|------|----------------|
| `main.jsx` | React entry |
| `App.jsx` | All routes (public + `/admin/*` + `/seller/*`) |
| `api.js` | Axios instance + `api` object. Handles admin/seller JWT. 401 auto-redirect. |
| `index.css` | Tailwind layers + custom classes |
| `categories.js` | Single source of truth for categories (slug/label/value) |
| `lib/img.js` | `optimizeCloudinary()` with `f_auto,q_auto,w_600`, `getProductImages()` |
| `components/` | |
| `Navbar.jsx` | Logo (`logo.webp`), category nav, search bar, cart icon, Admin link |
| `AppFooter.jsx` | Footer with shop/company/connect links |
| `BrandHero.jsx` | 110vh scroll hero, tagline/buttons fade in on 1.8s timer |
| `ProductCard.jsx` | Product card with carousel + stock badge + shopName |
| `ProductCarousel.jsx` | Multi-image carousel with arrows + dots |
| `StarRating.jsx` | Fractional star display (0–5) |
| `pages/` | |
| `Home.jsx` | BrandHero + featured 20 images grid + auto-scroll to hero buttons |
| `Category.jsx` | Products for a category (path-based, not useParams) |
| `ProductDetail.jsx` | Carousel + quantity +/- + shoe size table + shoePhone + dynamic JSON-LD |
| `Search.jsx` | Global search results |
| `Cart.jsx`, `Checkout.jsx` | Cart + checkout |
| `BulkOrders.jsx` | Bulk order inquiry page |
| `admin/` | AdminLogin, Dashboard, Products, Orders, Customers, ReviewsModeration, CourierHub, Logistics, Analytics, Shopkeepers, FeaturedRequests |
| `seller/` | SellerLogin, SellerSignup, ShopkeeperLayout (bottom nav), ShopkeeperProducts, ShopkeeperOrders, ShopkeeperCustomers, ShopkeeperAnalytics |

### `backend/`
| Path | Responsibility |
|------|----------------|
| `server.js` | Express app, middleware, route mounts |
| `config/db.js` | Mongoose connection |
| `models/` | `Product.js`, `Order.js`, `Review.js`, `Admin.js`, `Courier.js`, `Shopkeeper.js` |
| `controllers/` | `productController.js`, `orderController.js`, `reviewController.js`, `adminController.js`, `analyticsController.js`, `shopkeeperController.js` |
| `routes/` | `products.js`, `orders.js`, `reviews.js`, `admin.js`, `courier.js`, `analytics.js`, `shopkeepers.js`, `sellers.js`, `adminShopkeepers.js` |
| `middleware/` | `auth.js` (JWT `protect`), `shopkeeperAuth.js`, `upload.js` (multer memoryStorage + Cloudinary stream) |

---

## 5. Data Models (key fields)

**Product** (`backend/models/Product.js`)
- `name` (String, req), `description`, `price` (Number, req), `sizes` (String[]), `category` (enum), `images` (String[]), `image` (String, backward compat), `rating` (Number 0–5), `gender` (Male/Female/Unisex), `stock` (Number, default 0), `inStock` (bool), `featured` (bool), `featuredPending` (bool), `shopkeeper` (ref), `shopName` (String).

**Order** — `customer` {fullName, age, city, address, whatsapp, email, gender}, `items` [{product, name, price, size, quantity, image, shoePhone}], `totalAmount`, `deliveryCharge`, `status`, `reference` (unique), timestamps.

**Shopkeeper** — `email`, `password`, `shopName`, `status` (pending/approved/rejected/suspended), timestamps.

---

## 6. API Reference (summary)

Public:
- `GET /api/products` — supports `?category=`, `?featured=true`, `?search=`, `?gender=`, `?page=`, `?limit=`
- `GET /api/products/:id`
- `POST /api/orders` — create order (rate-limited, stock decrement, reference retry)
- `GET /api/admin/config` — brand + contact links + deliveryCharge + categories
- `POST /api/reviews`, `GET /api/reviews/product/:id`, `GET /api/reviews/product/:id/rating`

Admin (require `Authorization: Bearer <token>`):
- `POST /api/admin/login`, `GET /api/admin/me`
- `POST/PUT/DELETE /api/products` (+ `:id`) — multi-image upload via `images` field; `rating`, `featured`, `stock`, `gender` accepted
- `GET /api/orders`, `PUT /api/orders/:id/status`
- `GET /api/reviews/pending`, `PUT /api/reviews/:id/status`, `DELETE /api/reviews/:id`
- `GET /api/analytics/dashboard`, `/analytics/customers`, `/analytics/logistics`
- `GET /api/courier/couriers`, `POST /api/courier/couriers/:id/toggle`, `GET /api/courier/optimizer`
- `GET/POST/PUT/DELETE /api/admin/shopkeepers` — admin shopkeeper management
- `GET/PUT /api/admin/featured-requests` — admin featured approve/reject

Seller (require `Authorization: Bearer <seller_token>`):
- `POST /api/seller/signup`, `POST /api/seller/login`, `GET /api/seller/me`
- `GET/POST/PUT/DELETE /api/seller/products` — multi-image upload, stock, pagination
- `GET /api/seller/orders`, `PUT /api/seller/orders/:id/status` — pagination
- `GET /api/seller/analytics`, `GET /api/seller/customers`
- `PUT /api/seller/products/:id/request-featured`

---

## 7. Environment Variables (`backend/.env`)

| Key | Description |
|-----|-------------|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB Atlas URI |
| `JWT_SECRET` | JWT signing secret for admin |
| `SHOPKEEPER_JWT_SECRET` | JWT signing secret for shopkeepers |
| `ADMIN_EMAIL` | Seeded admin email |
| `ADMIN_PASSWORD` | Seeded admin password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CONTACT_WHATSAPP` | WhatsApp number |
| `CONTACT_EMAIL` | Email |
| `CONTACT_FACEBOOK` | Facebook URL |
| `CONTACT_WHATSAPP_COMMUNITY` | WhatsApp Community invite link |
| `DELIVERY_CHARGE` | Prepaid delivery charge (PKR) |

---

## 8. Deployment

- **Frontend → Netlify** (`wearout.shop`): build `npm run build`, deploy `dist/`. Netlify proxy: `/api/*` → `https://wear-out.onrender.com/api/:splat`.
- **Backend → Render** (`wear-out`): deploy `backend/`, set all `.env` vars.
- **Database → MongoDB Atlas** (free M0).
- **Images → Cloudinary** (free tier, 25GB storage + 25GB bandwidth/month). Images folder: `wearout/products`.
- **DNS → Hostinger**: A record `@ → 75.2.60.5`, CNAME `www → wear-out.netlify.app`.

---

## 9. How to Resume / Edit (instructions for an AI assistant)

1. **Always start both servers** (backend on 5000, frontend on 5173) before testing.
2. **Backend code edits** auto-reload via nodemon. **`.env` edits need a manual backend restart.**
3. **Frontend edits** hot-reload via Vite.
4. **Verification:** run `cd frontend && npm run build` to catch JSX/syntax errors.
5. **Common tasks → where to look:**
   - Add a product category → `frontend/src/categories.js` + `backend/models/Product.js` enum + `App.jsx` route + navbar
   - Change hero → `frontend/src/components/BrandHero.jsx`
   - Change logo → replace `frontend/public/assets/logo.webp`
   - Change featured-on-homepage → `Home.jsx` (uses `getProducts({ featured: 'true' })`)
   - Change contact/social → `backend/.env` `CONTACT_*` then restart
   - Admin panel → `frontend/src/pages/admin/*`
   - Seller panel → `frontend/src/pages/seller/*`
6. **Gotchas:**
   - `Category.jsx` derives category from URL path via `categories.js`, not `useParams`.
   - Admin/seller JWT stored in localStorage (`wearout_admin_token` / `wearout_seller_token`).
   - Images are stored on Cloudinary, not local disk. `upload.js` uses `multer.memoryStorage()` + stream.
   - `api.js` appends `/api` to `VITE_API_BASE`. Remove manual `Content-Type: multipart/form-data` — let axios auto-set.
   - Stock decrement uses `findOneAndUpdate` with `$gte` guard to prevent overselling.
   - Order reference generation retries up to 3 times on duplicate key.

---

## 10. Admin Access

1. Go to `/admin/login`.
2. Log in with `admin@wearout.store` / `wearout123`.
3. Manage products, orders, reviews, couriers, shopkeepers, featured requests.

## 11. Seller Access

1. Go to `/seller/signup` to create a shopkeeper account.
2. Admin approves via Admin Panel → Shopkeepers.
3. Seller logs in at `/seller/login` and manages products/orders/customers.

---

*Last updated: Cloudinary multi-image upload, multi-vendor shopkeeper system, stock tracking, pagination, SEO, performance optimizations, domain connected.*
