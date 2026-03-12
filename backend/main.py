from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from typing import List, Optional

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

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    if request.email == "admin@tiffinstash.com":
        user_data = {
            "id": "1",
            "email": "admin@tiffinstash.com",
            "name": "System Admin",
            "role": "ADMIN"
        }
        
        # Create JWT token
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
        to_encode = user_data.copy()
        to_encode.update({"exp": expire})
        
        token = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
        
        return {
            "token": token,
            "user": user_data
        }
    
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
        },
        {
            "id": "2",
            "name": "Bob Johnson",
            "email": "bob@example.com",
            "phone": "555-0101",
            "packages": 1,
            "mealsRemaining": 0,
            "revenue": 120.00,
            "status": "Expired"
        }
    ]

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
