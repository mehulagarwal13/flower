# 🎯 BouquetOfLove - ACTION ITEMS & REQUIREMENTS

## 🚨 CRITICAL: BEFORE YOU CAN RUN THE APP

### 1. Local Development Uses SQLite
**Why Needed:** You can run the app locally without PostgreSQL now

### 2. Production Will Use PostgreSQL
**Why Needed:** Set `DATABASE_URL` later when you deploy

**Steps:**
- **Windows:** 
  - Download from: https://www.postgresql.org/download/windows/
  - During installation, note the password you set for 'postgres' user
  - Select port 5432 (default)
  
- **Mac:** 
  ```bash
  brew install postgresql
  brew services start postgresql
  ```

- **Linux:** 
  ```bash
  sudo apt-get install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```

### 3. Update Backend Configuration for Production Later
Edit `/backend/.env` only when you're ready to deploy:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/flower_shop
```

**IMPORTANT:** Replace the placeholder values with your production PostgreSQL connection details.

### 4. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 5. Install Node Dependencies
```bash
cd frontend
npm install
```

---

## 🔧 FROM YOU: REQUIRED CONFIGURATIONS

### Your Shop Details (Already Have ✅)
- ✅ Shop name: BouquetOfLove
- ✅ WhatsApp number: 918979011405
- ✅ Products catalog (6 items)

### Your Products (ACTION REQUIRED ⏳)
You need to add your actual products to the database. Choose one method:

**Method 1: Using Python Script** (Easiest)
1. Create `/backend/seed_products.py` with your product details
2. Run: `python seed_products.py`
3. Products will be added automatically

**Method 2: Using API** (For testing)
```bash
curl -X POST "http://localhost:8000/api/admin/products" \
  -H "Content-Type: application/json" \
  -H "admin-pass: bouquetoflove2026" \
  -d '{
    "name": "Your Product Name",
    "category": "bouquets",
    "tagline": "Your tagline",
    "starting_price": 199,
    "base_price": 199,
    "description": "Full description",
    "images": ["url-to-image"],
    "is_active": true
  }'
```

### Product Images (ACTION REQUIRED ⏳)
Place product images in: `/frontend/public/images/`

Recommended:
- product1.jpg - Flower Bouquet sample
- product2.jpg - Alternative flower
- product3.png - Chocolate Bouquet
- product4.jpg - Photo Frame example
- product5.jpg - Card example
- product6.jpg - Hanky example

---

## 💳 PAYMENT SETUP (For Production)

### Razorpay Integration (Optional but Recommended)
**When Needed:** When you want to accept actual payments

**Steps:**
1. Create account at: https://razorpay.com
2. Get your Key ID and Key Secret
3. Add to `/backend/.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

**Current Status:** Placeholder endpoints ready, integration code needed

---

## 📧 EMAIL SETUP (Optional)

### SendGrid for Email Notifications
**When Needed:** To send order confirmations, status updates

**Steps:**
1. Create account at: https://sendgrid.com
2. Get API key
3. Add to `/backend/.env`:
   ```
   SENDGRID_API_KEY=your_api_key
   SHOP_EMAIL=your_shop_email@gmail.com
   ```

**Current Status:** Endpoints ready, integration code needed

---

## 💬 WhatsApp Integration (Optional)

### WhatsApp Business API
**When Needed:** For automated WhatsApp notifications

**Current Solution:** Already have WhatsApp quick-order button (working)

**Enhanced Option:** WhatsApp Business API
- Connect at: https://www.whatsapp.com/business/
- Gets more complex, recommended for Phase 2

---

## 🚀 QUICK START COMMANDS

### Terminal 1 - Start Backend
```bash
cd backend
python main.py
```
✅ You should see: "Uvicorn running on http://0.0.0.0:8000"

### Terminal 2 - Start Frontend  
```bash
cd frontend
npm run dev
```
✅ You should see: "Local: http://localhost:5173/"

### Terminal 3 - Test Backend (Optional)
```bash
curl http://localhost:8000/api/health
```
✅ Should return: `{"status":"ok","shop":"BouquetOfLove",...}`

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything works:

- [ ] PostgreSQL is running (database created)
- [ ] Backend starts without errors (python main.py)
- [ ] Frontend starts without errors (npm run dev)
- [ ] Can access http://localhost:5173 in browser
- [ ] Can see products on homepage
- [ ] Can add items to cart
- [ ] API health check works (http://localhost:8000/api/health)
- [ ] Admin panel accessible at /admin (password: bouquetoflove2026)

---

## 🐛 TROUBLESHOOTING

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
cd backend
pip install -r requirements.txt
```

### "FATAL: role 'postgres' does not exist"
PostgreSQL isn't running. Start it:
- Windows: Search "pgAdmin" and start PostgreSQL service
- Mac: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### "Database 'flower_shop' does not exist"
Create it:
```bash
psql -U postgres
CREATE DATABASE flower_shop;
```

### "Address already in use (port 8000)"
Change backend port:
```bash
uvicorn main:app --port 8001
```
Then update `frontend/src/api.js` API_BASE_URL

### "npm: command not found"
Install Node.js from: https://nodejs.org/

### "python: command not found"  
Install Python from: https://www.python.org/

---

## 📋 IMPORTANT FILES TO CHECK/UPDATE

### Backend
- [ ] `/backend/.env` - Database credentials
- [ ] `/backend/requirements.txt` - All dependencies installed
- [ ] `/backend/config.py` - Matches your setup

### Frontend  
- [ ] `/frontend/src/api.js` - Correct backend URL
- [ ] `/frontend/.env` - If any frontend env vars needed
- [ ] `/frontend/public/images/` - Product images present

---

## 🎯 NEXT STEPS AFTER BASIC SETUP

1. **Add Your Products** (Required)
   - Use API endpoints or Python script
   - Add product images
   
2. **Test Order Flow** (Required)
   - Browse products
   - Add to cart
   - Checkout (with current UPI method)
   - Verify order appears in admin panel

3. **Set Up Razorpay** (Recommended)
   - Get API keys
   - Implement integration
   - Test payment flow

4. **Configure Email** (Optional)
   - Set up SendGrid
   - Add order notification emails

5. **Production Deployment** (Later)
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel
   - Set up domain and SSL
   - Configure environment variables

---

## 🔐 SECURITY NOTES

⚠️ **Before Production:**

1. Change these in production:
   ```
   SECRET_KEY=generate-new-strong-key
   ADMIN_PASSWORD=change-from-default
   ```

2. Never commit `.env` file to git
3. Use environment variables for all secrets
4. Enable HTTPS (SSL/TLS)
5. Use strong database password
6. Set up database backups

---

## 📞 SUPPORT CHECKLIST

When reporting issues, provide:
- [ ] What command you ran
- [ ] Full error message (copy-paste)
- [ ] Your operating system
- [ ] PostgreSQL version (psql --version)
- [ ] Node.js version (node --version)
- [ ] Python version (python --version)

---

## ✨ YOU'RE READY TO GO!

Once you complete the above, run:

1. Backend: `python main.py`
2. Frontend: `npm run dev`
3. Visit: `http://localhost:5173`

🎉 Your BouquetOfLove e-commerce site is ready to test!

**Questions?** Check `IMPLEMENTATION_SUMMARY.md` and `SETUP_GUIDE.md` for detailed documentation.

---

**Status:** Ready for deployment  
**Last Updated:** May 6, 2026  
**Version:** 2.0.0
