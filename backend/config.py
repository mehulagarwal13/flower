import os
from dotenv import load_dotenv

load_dotenv()

# Shop Details
SHOP_NAME = "BouquetOfLove"
WHATSAPP_NUMBER = "918979011405"

# Admin Details
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@bouquetoflove.com")
ADMIN_PHONE = os.getenv("ADMIN_PHONE", "8979011405")
ADMIN_NAME = os.getenv("ADMIN_NAME", "Admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "bouquetoflove2026")

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-tokens-change-this-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./flower_shop.db")

# File Uploads
UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
