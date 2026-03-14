from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from typing import List, Optional
import requests
import json

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-tiffinstash")
ALGORITHM = "HS256"

SHOPIFY_CLIENT_ID = os.getenv("SHOPIFY_CLIENT_ID")
SHOPIFY_CLIENT_SECRET = os.getenv("SHOPIFY_CLIENT_SECRET")
SHOPIFY_SHOP_URL = os.getenv("SHOPIFY_SHOP_URL")

# --- In-memory cache (only refreshed via POST /api/meal-plans/refresh) ---
_meal_plans_cache: list = []

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    name: str
    role: str

class TokenResponse(BaseModel):
    token: str
    user: User

def get_shopify_access_token():
    url = f"{SHOPIFY_SHOP_URL}/admin/oauth/access_token"
    payload = {
        "grant_type": "client_credentials",
        "client_id": SHOPIFY_CLIENT_ID,
        "client_secret": SHOPIFY_CLIENT_SECRET
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(url, data=payload, headers=headers)
    response.raise_for_status()
    return response.json()["access_token"]

MEAL_PLAN_QUERY = """
query GetProducts($cursor: String) {
  products(first: 50, after: $cursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        handle
        productType
        tags
        vendor
        status
        collections(first: 10) {
          edges {
            node {
              title
            }
          }
        }
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              sku
              title
              price
              inventoryQuantity
            }
          }
        }
      }
    }
  }
}
"""

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    if request.email == "admin@tiffinstash.com":
        user_data = {
            "id": "1",
            "email": "admin@tiffinstash.com",
            "name": "System Admin",
            "role": "ADMIN"
        }
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
        to_encode = user_data.copy()
        to_encode.update({"exp": expire})
        token = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
        return {"token": token, "user": user_data}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    return {
        "totalCustomers": 1250,
        "activeCustomers": 1100,
        "totalRevenue": 85400,
        "pendingOrders": 12,
        "todayDeliveries": 315,
        "pendingPayments": 1200
    }

@app.get("/api/customers")
async def get_customers():
    return [
        {
            "id": "1",
            "name": "Alice Smith",
            "email": "alice@example.com",
            "phone": "555-0100",
            "packages": 2,
            "mealsRemaining": 15,
            "revenue": 350.00,
            "status": "Active"
        }
    ]

def _fetch_meal_plans_from_shopify() -> list:
    """Fetches all meal plan data directly from Shopify (no caching)."""
    access_token = get_shopify_access_token()
    url = f"{SHOPIFY_SHOP_URL}/admin/api/2024-01/graphql.json"
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token
    }
    all_rows = []
    cursor = None
    has_next_page = True
    while has_next_page:
        variables = {"cursor": cursor}
        response = requests.post(url, json={"query": MEAL_PLAN_QUERY, "variables": variables}, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Shopify error: {response.text}")
        res_json = response.json()
        data = res_json.get("data", {}).get("products", {})
        if not data:
            break
        for edge in data.get("edges", []):
            product = edge["node"]
            areas = [c['node']['title'] for c in product.get("collections", {}).get("edges", [])]
            tags_lower = [t.lower() for t in product.get("tags", [])]
            is_lunch = "lunch" in tags_lower or "lunch" in product["productType"].lower()
            is_dinner = "dinner" in tags_lower or "dinner" in product["productType"].lower()
            for v_edge in product["variants"]["edges"]:
                v = v_edge["node"]
                all_rows.append({
                    "id": v["id"],
                    "sku": v["sku"],
                    "name": product["title"],
                    "variant": v["title"],
                    "type": product["productType"],
                    "is_lunch": is_lunch,
                    "is_dinner": is_dinner,
                    "areas": areas,
                    "price": float(v["price"]),
                    "tags": product.get("tags", []),
                    "vendor": product["vendor"],
                    "inventory": v.get("inventoryQuantity"),
                    "status": product["status"]
                })
        page_info = data.get("pageInfo", {})
        has_next_page = page_info.get("hasNextPage", False)
        cursor = page_info.get("endCursor")
    return all_rows


@app.get("/api/meal-plans")
async def get_meal_plans():
    global _meal_plans_cache
    try:
        if _meal_plans_cache:
            return _meal_plans_cache  # Always return from cache
        # Cache is empty (first boot) — fetch once to warm it
        data = _fetch_meal_plans_from_shopify()
        _meal_plans_cache = data
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/meal-plans/refresh")
async def refresh_meal_plans():
    """Force-refresh the meal plans cache from Shopify (called by Sync Shopify button)."""
    global _meal_plans_cache
    try:
        data = _fetch_meal_plans_from_shopify()
        _meal_plans_cache = data
        return {"message": f"Cache refreshed. {len(data)} plans loaded."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
