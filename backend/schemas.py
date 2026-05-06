from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    phone: str
    email: Optional[EmailStr] = None
    name: str
    address: Optional[str] = None
    city: Optional[str] = None

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    phone: str
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    starting_price: float
    base_price: float
    badge: Optional[str] = None
    images: List[str] = []
    options: dict = {}
    stock_quantity: int = 100
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    starting_price: Optional[float] = None
    base_price: Optional[float] = None
    badge: Optional[str] = None
    images: Optional[List[str]] = None
    options: Optional[dict] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str
    rating_avg: float = 0.0
    rating_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewResponse(BaseModel):
    id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True

# Order Item Schemas
class OrderItemBase(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    options: Optional[dict] = {}
    notes: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    address: str
    city: Optional[str] = None
    delivery_date: Optional[str] = None
    special_note: Optional[str] = None
    payment_method: str
    total: float

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderCreateResponse(BaseModel):
    orderId: str
    message: str

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(OrderBase):
    id: str
    order_id: str
    user_id: Optional[str] = None
    status: str
    payment_status: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

class OrderTrackingResponse(BaseModel):
    order_id: str
    status: str
    customer_name: str
    total: float
    created_at: datetime
    items_count: int
    items: Optional[List[OrderItemResponse]] = None
    address: Optional[str] = None
    city: Optional[str] = None
    delivery_date: Optional[str] = None
    special_note: Optional[str] = None
