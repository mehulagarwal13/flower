# 🌸 BouquetOfLove - Handmade Gifts E-Commerce Platform

**Version:** 2.0.0  
**Status:** ✅ Production Ready (with Configuration)  
**Last Updated:** May 6, 2026

---

## 📖 OVERVIEW

A complete, full-featured e-commerce website for selling handmade gifts (bouquets, chocolate bouquets, photo frames, cards, embroidered hankies, and cab booking). Built with React + Vite frontend and Python + FastAPI backend.

**Theme:** Warm, handmade, personal - with soft pinks, creams, and earthy tones throughout.

---

## 🚀 QUICK START (5 MINUTES)

### Prerequisites
- PostgreSQL installed
- Python 3.8+
- Node.js 16+
- npm

### 1. Database Setup
Local development uses SQLite automatically, so you can start the app without installing PostgreSQL.

For production, set `DATABASE_URL` to your PostgreSQL connection string.

### 2. Backend Setup & Start
```bash
cd backend
pip install -r requirements.txt
# Local development uses SQLite by default
# For production: DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/flower_shop
python main.py
```
✅ Backend: http://localhost:8000

### 3. Frontend Setup & Start (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend: http://localhost:5173

---

## 📚 DOCUMENTATION

- **[ACTION_ITEMS.md](ACTION_ITEMS.md)** - What you need to do (START HERE)
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built
- **[backend/SETUP_GUIDE.md](backend/SETUP_GUIDE.md)** - Detailed setup
- **API Docs:** http://localhost:8000/docs (when running)

---

## ✨ FEATURES

✅ **Customer Features:**
- Browse and customize products
- Add to cart and checkout
- Track orders by ID or phone
- Quick order via WhatsApp
- Mobile-friendly design

✅ **Admin Features:**
- Manage all orders
- Update order status in real-time
- Manage products (add/edit/delete)
- View customer uploads

✅ **Products:**
1. Flower Bouquet (type + size selection)
2. Chocolate Bouquet (brand + wrapping)
3. Photo Frame (size + photo upload + color)
4. Handmade Card (material + unlimited photos + message)
5. Embroidered Hanky (gender + design + custom embroidery)
6. Cab Booking (pickup/destination + WhatsApp)

---

## 🏗️ TECH STACK

- **Frontend:** React 19, Vite, Axios, React Router
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, JWT
- **Deployment Ready:** Vercel (frontend), Railway/Render (backend)

---

## 📁 KEY FILES

**Backend:**
- `main.py` - All API endpoints
- `models.py` - Database models
- `auth.py` - JWT utilities
- `.env` - Configuration (NEEDS YOUR DATABASE PASSWORD)

**Frontend:**
- `src/api.js` - API client
- `src/pages/OrderTracking.jsx` - NEW: Track orders
- `src/components/PhotoFrameCustomiser.jsx` - NEW: Photo editor
- `src/components/HandmadeCardCustomiser.jsx` - NEW: Card editor
- `src/components/EmbroideredHankyCustomiser.jsx` - NEW: Hanky editor
- `src/components/CabBookingCustomiser.jsx` - NEW: Cab booking

---

## ⏳ WHAT YOU NEED TO DO

1. **Start locally with SQLite** by running `python main.py`
2. **Set PostgreSQL `DATABASE_URL` later** when you deploy
3. **Start frontend:** `npm run dev`
4. **Add products** (see ACTION_ITEMS.md)

---

## 🔑 IMPORTANT NOTES

- ⚠️ **Must have PostgreSQL running** before backend starts
- 🔐 Admin password: `bouquetoflove2026` (change before production!)
- 📸 Add your product images to `/frontend/public/images/`
- 💳 Razorpay integration is ready for your API keys
- 📧 Email notifications ready for SendGrid integration

---

## ✅ WHAT'S IMPLEMENTED

**Backend (100% Complete):**
- All 6 product types with database models
- User authentication with JWT
- Complete order management
- File uploads for customization
- Admin authentication & management
- Order tracking by ID or phone
- Razorpay payment placeholder (ready for integration)

**Frontend (100% Complete):**
- All pages and routing
- All 6 product customizers
- Order tracking page
- Cart and checkout flow
- Admin panel
- Responsive mobile design
- API integration ready

---

## 🚀 NEXT STEPS

**Immediate:**
1. Follow QUICK START above
2. Check ACTION_ITEMS.md for setup details
3. Add your 6 products to database

**Soon:**
1. Integrate Razorpay for payments
2. Set up email notifications
3. Configure WhatsApp API (optional)
4. Deploy to production

---

For detailed instructions, see **[ACTION_ITEMS.md](ACTION_ITEMS.md)**  
For technical details, see **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**

**Built for BouquetOfLove 🌸**
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
