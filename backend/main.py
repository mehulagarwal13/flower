from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json, os
from datetime import datetime

app = FastAPI(title="BouquetOfLove API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ORDERS_FILE = os.path.join(os.path.dirname(__file__), "orders.json")


def load_orders() -> list:
    if not os.path.exists(ORDERS_FILE):
        return []
    with open(ORDERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_orders(orders: list):
    with open(ORDERS_FILE, "w", encoding="utf-8") as f:
        json.dump(orders, f, indent=2, ensure_ascii=False)


# ── Models ────────────────────────────────────────────────

class OrderItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int
    cartKey: Optional[str] = None


class OrderCreate(BaseModel):
    name: str
    phone: str
    address: str
    city: Optional[str] = ""
    date: Optional[str] = ""
    note: Optional[str] = ""
    payment: str
    items: List[OrderItem]
    total: float


class StatusUpdate(BaseModel):
    status: str


# ── Routes ────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "shop": "BouquetOfLove", "time": datetime.now().isoformat()}


@app.post("/api/orders", status_code=201)
def create_order(order: OrderCreate):
    orders = load_orders()
    order_id = "BOL" + datetime.now().strftime("%d%H%M%S") + str(len(orders))
    new_order = {
        "orderId": order_id,
        "status": "Received",
        "createdAt": datetime.now().isoformat(),
        **order.model_dump(),
    }
    orders.append(new_order)
    save_orders(orders)
    return {"orderId": order_id, "message": "Order placed successfully! 🌸"}


@app.get("/api/orders")
def get_orders():
    return load_orders()


@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    orders = load_orders()
    for o in orders:
        if o["orderId"] == order_id:
            return o
    raise HTTPException(status_code=404, detail="Order not found")


@app.patch("/api/orders/{order_id}/status")
def update_status(order_id: str, body: StatusUpdate):
    orders = load_orders()
    for o in orders:
        if o["orderId"] == order_id:
            o["status"] = body.status
            save_orders(orders)
            return o
    raise HTTPException(status_code=404, detail="Order not found")


@app.delete("/api/orders/{order_id}")
def delete_order(order_id: str):
    orders = load_orders()
    updated = [o for o in orders if o["orderId"] != order_id]
    if len(updated) == len(orders):
        raise HTTPException(status_code=404, detail="Order not found")
    save_orders(updated)
    return {"message": "Order deleted"}
