# BouquetOfLove — Backend

FastAPI backend for order management.

## Setup & Run

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be live at: http://localhost:8000
Docs (Swagger): http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/orders | Create new order |
| GET | /api/orders | List all orders (admin) |
| GET | /api/orders/{id} | Get single order |
| PATCH | /api/orders/{id}/status | Update order status |
| DELETE | /api/orders/{id} | Delete order |

## Admin Panel
Password: `bouquetoflove2026`
Visit: http://localhost:5173/admin (or 5174)

## Config
- WhatsApp: 918979011405
- GPay UPI: mehulagarwal1313-1@okaxis
- Instagram: @bouquetoflove44
