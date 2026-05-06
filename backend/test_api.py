import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_api():
    print("Starting Backend Tests...")
    
    # 1. Register a user
    print("\n[1] Registering User...")
    payload = {
        "email": "tester@example.com",
        "password": "password123",
        "name": "Test User",
        "phone": "9999999999"
    }
    try:
        res = requests.post(f"{BASE_URL}/auth/register", json=payload)
        print(f"Status: {res.status_code}")
        print(res.json())
    except Exception as e:
        print(f"Error: {e}")

    # 2. Login
    print("\n[2] Logging In...")
    payload = {
        "phone": "9999999999",
        "password": "password123"
    }
    try:
        res = requests.post(f"{BASE_URL}/auth/login", json=payload)
        print(f"Status: {res.status_code}")
        token = res.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print(f"Token: {token[:20]}...")
    except Exception as e:
        print(f"Error: {e}")
        return

    # 2.5 Admin Login & Create Product
    print("\n[2.5] Admin Login & Seeding Product...")
    admin_payload = {
        "phone": "8979011405", # Default admin phone from config
        "password": "bouquetoflove2026"
    }
    try:
        admin_res = requests.post(f"{BASE_URL}/auth/login", json=admin_payload)
        admin_token = admin_res.json().get("access_token")
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create a product
        prod_payload = {
            "name": "Test Rose Bouquet",
            "category": "bouquets",
            "tagline": "Fresh and beautiful",
            "description": "A wonderful bouquet for testing",
            "starting_price": 599.0,
            "base_price": 400.0,
            "stock_quantity": 50,
            "is_active": True
        }
        res = requests.post(f"{BASE_URL}/admin/products", json=prod_payload, headers=admin_headers)
        print(f"Product creation status: {res.status_code}")
    except Exception as e:
        print(f"Admin seeding error: {e}")

    # 3. Get Products
    print("\n[3] Fetching Products...")
    res = requests.get(f"{BASE_URL}/products")
    products = res.json()
    print(f"Found {len(products)} products")
    if products:
        p_id = products[0]['id']
        print(f"First product: {products[0]['name']} (ID: {p_id}, Stock: {products[0].get('stock_quantity')})")

    # 4. Create Order
    print("\n[4] Creating Order...")
    if products:
        order_payload = {
            "customer_name": "Test User",
            "customer_phone": "9999999999",
            "customer_email": "tester@example.com",
            "address": "123 Test St",
            "city": "Test City",
            "delivery_date": "2026-05-10",
            "total": products[0]['starting_price'],
            "payment_method": "UPI",
            "items": [
                {
                    "product_id": products[0]['id'],
                    "product_name": products[0]['name'],
                    "quantity": 1,
                    "price": products[0]['starting_price']
                }
            ]
        }
        res = requests.post(f"{BASE_URL}/orders", json=order_payload, headers=headers)
        print(f"Status: {res.status_code}")
        print("Order created successfully")

    # 5. Check Stock
    print("\n[5] Checking Stock Decrease...")
    res = requests.get(f"{BASE_URL}/products")
    products_after = res.json()
    if products_after:
        print(f"Stock after: {products_after[0].get('stock_quantity')}")

    # 6. Add Review
    print("\n[6] Adding Review...")
    if products:
        review_payload = {
            "rating": 5,
            "comment": "Amazing quality! Highly recommended."
        }
        res = requests.post(f"{BASE_URL}/products/{products[0]['id']}/reviews", json=review_payload, headers=headers)
        print(f"Status: {res.status_code}")
        print("Review added successfully")

    # 7. Admin Analytics
    print("\n[7] Admin Analytics...")
    # Using admin login (mocked for now, assuming tester is admin or using default admin)
    # Let's try to get profile
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    user_info = res.json()
    if user_info.get("is_admin"):
        res = requests.get(f"{BASE_URL}/admin/analytics", headers=headers)
        print(f"Analytics: {res.json()}")
    else:
        print("User is not admin, skipping analytics test.")

    print("\nTests Complete!")

if __name__ == "__main__":
    test_api()
