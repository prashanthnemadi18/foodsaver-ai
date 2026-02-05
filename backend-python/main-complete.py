"""
FoodSaver AI - Complete Python Backend
All features in one backend (FastAPI)
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime, timedelta
import os
import uuid

# Initialize FastAPI
app = FastAPI(
    title="FoodSaver AI - Complete Backend",
    description="Complete food management system with AI",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 FoodSaver AI - Complete Backend Starting...")
print("✅ All features initialized!\n")

# ============================================
# IN-MEMORY STORAGE (Replace with database in production)
# ============================================

users_db = {}  # {username: {password, userId}}
items_db = {}  # {itemId: {item data}}

# ============================================
# DATA MODELS
# ============================================

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class ItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    storage_condition: Optional[str] = "fridge"
    opened: Optional[bool] = False
    purchase_date: Optional[str] = None

class ItemUpdate(BaseModel):
    status: Optional[str] = None

class SuggestionRequest(BaseModel):
    item_name: str
    category: Optional[str] = "Food"
    status: Optional[str] = "Fresh"
    storage_condition: Optional[str] = "fridge"

# ============================================
# HELPER FUNCTIONS
# ============================================

def predict_expiry(item: dict) -> dict:
    """Predict expiry date based on storage and category"""
    expiry_days = {
        'fridge': {'dairy': 7, 'vegetable': 5, 'fruit': 5, 'meat': 3, 'default': 5},
        'freezer': {'default': 90},
        'pantry': {'default': 30}
    }
    
    storage = item.get('storage_condition', 'fridge')
    category = item.get('category', 'default').lower() if item.get('category') else 'default'
    days = expiry_days.get(storage, {}).get(category, expiry_days.get(storage, {}).get('default', 5))
    
    purchase_date_str = item.get('purchase_date')
    if purchase_date_str:
        purchase_date = datetime.fromisoformat(purchase_date_str.replace('Z', '+00:00'))
    else:
        purchase_date = datetime.now()
    
    expiry_date = purchase_date + timedelta(days=days)
    
    today = datetime.now()
    days_until_expiry = (expiry_date - today).days
    
    if days_until_expiry < 0:
        item_status = 'expired'
    elif days_until_expiry <= 3:
        item_status = 'expiring soon'
    else:
        item_status = 'fresh'
    
    return {
        'predicted_expiry': expiry_date.date().isoformat(),
        'status': item_status,
        'daysUntilExpiry': days_until_expiry
    }

def generate_smart_suggestion(item_name: str, category: str, status: str, storage: str) -> str:
    """Generate AI suggestions"""
    FOOD_SUGGESTIONS = {
        "apple": {
            "fresh": "🍎 Fresh Apple Ideas:\n• Slice with peanut butter\n• Add to oatmeal\n• Make Waldorf salad\n• Bake muffins\n• Healthy snack",
            "expiring": "🍎 Quick Apple Recipes:\n• Fresh juice\n• Apple pie\n• Applesauce\n• Smoothies\n• Roast with pork",
            "expired": "🍎 Soft Apple Uses:\n• Applesauce\n• Apple butter\n• Cider vinegar\n• Dehydrate\n• Compost"
        },
        "banana": {
            "fresh": "🍌 Fresh Banana:\n• Cereal topping\n• Protein shake\n• Toast with honey\n• Snack\n• Yogurt parfait",
            "expiring": "🍌 Ripe Banana:\n• Freeze for smoothies\n• Banana bread\n• Pancakes\n• Nice cream\n• Muffins",
            "expired": "🍌 Overripe Banana:\n• Banana bread\n• Ice cream\n• Face mask\n• Smoothie sweetener\n• Pancakes"
        }
    }
    
    item_lower = item_name.lower()
    status_lower = status.lower()
    
    status_key = "expired" if "expired" in status_lower else "expiring" if "expiring" in status_lower else "fresh"
    
    for key, suggestions in FOOD_SUGGESTIONS.items():
        if key in item_lower:
            return suggestions[status_key]
    
    status_emoji = "✨" if status_key == "fresh" else "⚡" if status_key == "expiring" else "♻️"
    
    if status_key == "fresh":
        return f"{status_emoji} Fresh {item_name}:\n• Enjoy as snack\n• Use in recipes\n• Store properly\n• Share with family\n• Plan meals"
    elif status_key == "expiring":
        return f"{status_emoji} Quick {item_name}:\n• Use in next meal\n• Freeze for later\n• Make quick recipe\n• Share\n• Preserve"
    else:
        return f"{status_emoji} Creative {item_name}:\n• Check if compostable\n• Non-food uses\n• Make stock\n• Fertilizer\n• DIY projects"

# ============================================
# AUTH ENDPOINTS
# ============================================

@app.post("/auth/register")
async def register(request: RegisterRequest):
    """Register new user"""
    if request.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = str(uuid.uuid4())
    users_db[request.username] = {
        "password": request.password,  # In production, hash this!
        "userId": user_id
    }
    
    return {
        "message": "User registered successfully",
        "userId": user_id,
        "username": request.username
    }

@app.post("/auth/login")
async def login(request: LoginRequest):
    """Login user"""
    user = users_db.get(request.username)
    
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "userId": user["userId"],
        "username": request.username
    }

# ============================================
# ITEMS ENDPOINTS
# ============================================

@app.get("/users/{user_id}/items")
async def get_items(user_id: str):
    """Get all items for a user"""
    user_items = [item for item in items_db.values() if item.get("userId") == user_id]
    return user_items

@app.post("/users/{user_id}/items")
async def create_item(user_id: str, item: ItemCreate):
    """Create new item"""
    if not item.name:
        raise HTTPException(status_code=400, detail="Item name is required")
    
    item_id = str(uuid.uuid4())
    
    new_item = {
        "id": item_id,
        "userId": user_id,
        "name": item.name,
        "category": item.category,
        "storage_condition": item.storage_condition or "fridge",
        "opened": item.opened or False,
        "purchase_date": item.purchase_date or datetime.now().date().isoformat(),
        "createdAt": datetime.now().isoformat()
    }
    
    # Add expiry prediction
    prediction = predict_expiry(new_item)
    new_item.update(prediction)
    
    items_db[item_id] = new_item
    
    return new_item

@app.patch("/users/{user_id}/items/{item_id}")
async def update_item(user_id: str, item_id: str, update: ItemUpdate):
    """Update item status"""
    item = items_db.get(item_id)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if item.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    if update.status:
        item["status"] = update.status
    
    items_db[item_id] = item
    return item

@app.delete("/users/{user_id}/items/{item_id}")
async def delete_item(user_id: str, item_id: str):
    """Delete item"""
    item = items_db.get(item_id)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if item.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    del items_db[item_id]
    return {"message": "Item deleted successfully"}

# ============================================
# AI SUGGESTIONS ENDPOINT
# ============================================

@app.post("/ai-suggestions")
async def get_ai_suggestions(request: SuggestionRequest):
    """Generate AI-powered food suggestions"""
    try:
        suggestion = generate_smart_suggestion(
            request.item_name,
            request.category,
            request.status,
            request.storage_condition
        )
        
        return {
            "suggestion": suggestion,
            "source": "python_backend",
            "provider": "FoodSaver AI",
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# ANALYTICS ENDPOINTS
# ============================================

@app.get("/analytics/{user_id}")
async def get_analytics(user_id: str):
    """Get user analytics"""
    user_items = [item for item in items_db.values() if item.get("userId") == user_id]
    
    total_items = len(user_items)
    fresh_items = len([i for i in user_items if i.get("status") == "fresh"])
    expiring_items = len([i for i in user_items if i.get("status") == "expiring soon"])
    expired_items = len([i for i in user_items if i.get("status") == "expired"])
    
    return {
        "totalItems": total_items,
        "freshItems": fresh_items,
        "expiringItems": expiring_items,
        "expiredItems": expired_items,
        "wasteReduction": f"{(fresh_items / total_items * 100) if total_items > 0 else 0:.1f}%"
    }

# ============================================
# HEALTH & ROOT ENDPOINTS
# ============================================

@app.get("/")
async def root():
    return {
        "name": "FoodSaver AI - Complete Backend",
        "version": "2.0.0",
        "status": "running",
        "backend": "Python FastAPI",
        "features": ["auth", "items", "ai-suggestions", "analytics"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    
    print(f"\n{'='*60}")
    print(f"🚀 FoodSaver AI - Complete Python Backend")
    print(f"{'='*60}")
    print(f"📍 Running on: http://localhost:{port}")
    print(f"📚 API Docs: http://localhost:{port}/docs")
    print(f"💚 Health: http://localhost:{port}/health")
    print(f"{'='*60}\n")
    
    uvicorn.run(
        "main-complete:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
