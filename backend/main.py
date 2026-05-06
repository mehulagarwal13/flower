import os
import shutil
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc

# Local imports
from database import get_db, init_db
from models import User, Product, Order, OrderItem, FileUpload, Notification
from auth import hash_password, verify_password, create_access_token, verify_token
from schemas import (
    UserRegister, UserLogin, AdminLogin, TokenResponse, UserResponse,
    ProductCreate, ProductUpdate, ProductResponse,
    OrderCreate, OrderStatusUpdate, OrderResponse, OrderTrackingResponse,
    OrderCreateResponse,
    OrderItemCreate,
)
from config import (
    UPLOAD_DIR, ALLOWED_EXTENSIONS, MAX_FILE_SIZE,
    ADMIN_EMAIL, ADMIN_PHONE, ADMIN_NAME, ADMIN_PASSWORD,
    SHOP_NAME, WHATSAPP_NUMBER
)

# ── FastAPI Setup ──────────────────────────────────────────────────

app = FastAPI(
    title="BouquetOfLove API",
    version="2.0.0",
    description="E-commerce API for handmade gifts"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Initialize database on startup
@app.on_event("startup")
async def startup():
    init_db()
    # Seed a default admin account for dashboard access
    from database import SessionLocal
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                phone=ADMIN_PHONE,
                email=ADMIN_EMAIL,
                name=ADMIN_NAME,
                password_hash=hash_password(ADMIN_PASSWORD),
                address="",
                city="",
                is_admin=True,
            )
            db.add(admin)
            db.commit()
            print(f"✅ Admin account created: {ADMIN_EMAIL}")
        elif not admin.is_admin:
            admin.is_admin = True
            db.commit()
    finally:
        db.close()
    print("✅ Database initialized")

# ── Helper Functions ───────────────────────────────────────────────

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    """Get current authenticated user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the authenticated user is an admin"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def generate_order_id(db: Session) -> str:
    """Generate unique order ID"""
    count = db.query(Order).count()
    return "BOL" + datetime.now().strftime("%d%H%M%S") + str(count)


def save_uploaded_file(file: UploadFile, order_id: str) -> str:
    """Save uploaded file and return file path"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Validate extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed. Allowed: {ALLOWED_EXTENSIONS}")
    
    # Create order-specific directory
    order_upload_dir = os.path.join(UPLOAD_DIR, order_id)
    os.makedirs(order_upload_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(order_upload_dir, filename)
    
    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return f"/uploads/{order_id}/{filename}"


# ═══════════════════════════════════════════════════════════════════════════════
# ── HEALTH & BASIC ENDPOINTS ──────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "shop": SHOP_NAME,
        "time": datetime.utcnow().isoformat(),
        "version": "2.0.0"
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ── AUTHENTICATION ENDPOINTS ───────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.phone == user_data.phone) | (User.email == user_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists with this phone/email")
    
    # Create new user
    new_user = User(
        phone=user_data.phone,
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        address=user_data.address,
        city=user_data.city,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(new_user)
    }


@app.post("/api/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user with phone and password"""
    user = db.query(User).filter(User.phone == credentials.phone).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid phone or password")
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }


@app.post("/api/admin/login", response_model=TokenResponse)
def admin_login(credentials: AdminLogin, db: Session = Depends(get_db)):
    """Login admin with email and password"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not user.is_admin or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    access_token = create_access_token(data={"sub": user.id, "role": "admin"})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }


@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse.model_validate(current_user)


# ═══════════════════════════════════════════════════════════════════════════════
# ── PRODUCT ENDPOINTS ──────────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/products", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all products, optionally filtered by category"""
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category == category)
    
    return query.all()


@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product


@app.get("/api/admin/products", response_model=List[ProductResponse])
def get_admin_products(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all products for admin management"""
    return db.query(Product).order_by(desc(Product.created_at)).all()


@app.get("/api/admin/me", response_model=UserResponse)
def get_admin_profile(current_admin: User = Depends(get_current_admin)):
    """Get current admin profile"""
    return UserResponse.model_validate(current_admin)


@app.post("/api/admin/products", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new product (admin only)"""
    new_product = Product(**product_data.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product


@app.patch("/api/admin/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)
    
    return product


@app.delete("/api/admin/products/{product_id}")
def delete_product(
    product_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}


# ═══════════════════════════════════════════════════════════════════════════════
# ── ORDER ENDPOINTS ────────────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/orders", response_model=OrderCreateResponse)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    """Create a new order"""
    # Generate order ID
    order_id = generate_order_id(db)
    
    # Create order
    new_order = Order(
        order_id=order_id,
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        address=order_data.address,
        city=order_data.city,
        delivery_date=order_data.delivery_date,
        special_note=order_data.special_note,
        payment_method=order_data.payment_method,
        total=order_data.total,
        status="Received"
    )
    
    # Add order items
    for item_data in order_data.items:
        order_item = OrderItem(
            product_id=item_data.product_id,
            product_name=item_data.product_name,
            quantity=item_data.quantity,
            price=item_data.price,
            options=item_data.options or {},
            notes=item_data.notes
        )
        new_order.items.append(order_item)
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return {
        "orderId": order_id,
        "message": f"Order {order_id} placed successfully! 🌸"
    }


@app.get("/api/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    """Get order details"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


@app.get("/api/orders/track/{order_id_or_phone}", response_model=OrderTrackingResponse)
def track_order(order_id_or_phone: str, db: Session = Depends(get_db)):
    """Track order by order ID or phone number"""
    # Try to find by order ID first
    order = db.query(Order).filter(Order.order_id == order_id_or_phone).first()
    
    # If not found, try by phone
    if not order:
        order = db.query(Order).filter(
            Order.customer_phone == order_id_or_phone
        ).order_by(desc(Order.created_at)).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return OrderTrackingResponse(
        order_id=order.order_id,
        status=order.status,
        customer_name=order.customer_name,
        total=order.total,
        created_at=order.created_at,
        items_count=len(order.items)
    )


@app.patch("/api/admin/orders/{order_id}/status")
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update order status (admin only)"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    
    return {"message": f"Order status updated to {status_update.status}", "order": order}


@app.get("/api/admin/orders")
def get_all_orders(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all orders (admin only)"""
    orders = db.query(Order).order_by(desc(Order.created_at)).all()
    return orders


@app.delete("/api/admin/orders/{order_id}")
def delete_order(
    order_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete an order (admin only)"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    
    return {"message": "Order deleted successfully"}


# ═══════════════════════════════════════════════════════════════════════════════
# ── FILE UPLOAD ENDPOINTS ──────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/upload/order/{order_id}")
async def upload_file_for_order(
    order_id: str,
    file: UploadFile = File(...),
    file_type: str = "photo",
    db: Session = Depends(get_db)
):
    """Upload file for an order (photos for frames/cards, design references, etc.)"""
    # Verify order exists
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Save file
    file_path = save_uploaded_file(file, order_id)
    
    # Record file upload in database
    file_upload = FileUpload(
        order_id=order.id,
        file_name=file.filename,
        file_path=file_path,
        file_type=file_type,
        file_size=len(await file.read())
    )
    db.add(file_upload)
    db.commit()
    db.refresh(file_upload)
    
    return {
        "message": "File uploaded successfully",
        "file_path": file_path,
        "file_type": file_type
    }


@app.post("/api/upload/temp")
async def upload_temp_file(file: UploadFile = File(...)):
    """Upload file temporarily (for preview before order creation)"""
    # Save to temp directory
    temp_dir = os.path.join(UPLOAD_DIR, "temp")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(temp_dir, filename)
    
    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "message": "File uploaded temporarily",
        "file_path": f"/uploads/temp/{filename}",
        "file_name": filename
    }


@app.get("/api/admin/order/{order_id}/files")
def get_order_files(
    order_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all files uploaded for an order (admin only)"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    files = db.query(FileUpload).filter(FileUpload.order_id == order.id).all()
    return files


# ═══════════════════════════════════════════════════════════════════════════════
# ── PAYMENT ENDPOINTS (RAZORPAY PLACEHOLDER) ───────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/payment/razorpay/order")
def create_razorpay_order(order_data: dict, db: Session = Depends(get_db)):
    """Create Razorpay order (placeholder - integrate with actual Razorpay API)"""
    # TODO: Implement actual Razorpay integration
    # For now, return mock response
    return {
        "id": f"order_test_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "amount": order_data.get("amount"),
        "currency": order_data.get("currency", "INR"),
        "status": "created"
    }


@app.post("/api/payment/razorpay/verify")
def verify_razorpay_payment(payment_data: dict, db: Session = Depends(get_db)):
    """Verify Razorpay payment (placeholder - integrate with actual Razorpay API)"""
    # TODO: Implement actual Razorpay verification
    # For now, return success
    return {
        "status": "verified",
        "message": "Payment verified successfully"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
