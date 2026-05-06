import uuid
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    phone = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    address = Column(String)
    city = Column(String)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    category = Column(String)
    tagline = Column(String)
    description = Column(String)
    starting_price = Column(Float)
    base_price = Column(Float)
    badge = Column(String)
    images = Column(JSON, default=[])
    options = Column(JSON, default={})
    stock_quantity = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    customer_email = Column(String)
    address = Column(String)
    city = Column(String)
    delivery_date = Column(String)
    special_note = Column(String)
    payment_method = Column(String)
    payment_status = Column(String, default="Pending")
    razorpay_order_id = Column(String)
    total = Column(Float)
    status = Column(String, default="Received")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    files = relationship("FileUpload", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id"))
    product_id = Column(String)
    product_name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    options = Column(JSON, default={})
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="items")

class FileUpload(Base):
    __tablename__ = "file_uploads"
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id"))
    order_item_id = Column(String, nullable=True)
    file_name = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="files")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id"))
    type = Column(String) # email, sms, whatsapp
    subject = Column(String)
    message = Column(String)
    sent_to = Column(String)
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"))
    user_id = Column(String, ForeignKey("users.id"))
    user_name = Column(String)
    rating = Column(Integer) # 1-5
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="reviews")
