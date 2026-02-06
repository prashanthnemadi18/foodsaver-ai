"""
FoodSaver AI - Backend with CUSTOM TRAINED Models
Uses YOUR trained models instead of pre-trained ones!
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
import uuid

# Import custom trained models
from ml_models.expiry_predictor import get_predictor
from ml_models.recipe_generator import get_generator

# Initialize FastAPI
app = FastAPI(
    title="FoodSaver AI - Custom Trained Models",
    description="Using YOUR custom trained ML models",
    version="3.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 FoodSaver AI - Custom Trained Models Backend")
print("=" * 60)

# Load custom models
try:
    expiry_predictor = get_predictor()
    print("✅ Custom Expiry Predictor loaded!")
except Exception as e:
    print(f"⚠️  Expiry Predictor not available: {e}")
    expiry_predictor = None

try:
    recipe_generator = get_generator()
    print("✅ Custom Recipe Generator loaded!")
except Exception as e:
    print(f"⚠️  Recipe Generator not available: {e}")
    recipe_generator = None

print("=" * 60 + "\n")

# ============================================
# IN-MEMORY STORAGE
# ============================================

users_db = {}
items_db = {}

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

class TrainRequest(BaseModel):
    model_type: str  # 'expiry' or 'recipe'

# ============================================
# AUTH ENDPOINTS
# ============================================

@app.post("/auth/register")
async def register(request: RegisterRequest):
    if request.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = str(uuid.uuid4())
    users_db[request.username] = {
        "password": request.password,
        "userId": user_id
    }
    
    return {
        "message": "User registered successfully",
        "userId": user_id,
        "username": request.username
    }

@app.post("/auth/login")
async def login(request: LoginRequest):
    user = users_db.get(request.username)
    
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "userId": user["userId"],
        "username": request.username
    }

# ============================================
# ITEMS ENDPOINTS (Using Custom Expiry Model)
# ============================================

@app.get("/users/{user_id}/items")
async def get_items(user_id: str):
    user_items = [item for item in items_db.values() if item.get("userId") == user_id]
    return user_items

@app.post("/users/{user_id}/items")
async def create_item(user_id: str, item: ItemCreate):
    if not item.name:
        raise HTTPException(status_code=400, detail="Item name is required")
    
    item_id = str(uuid.uuid4())
    
    new_item = {
        "id": item_id,
        "userId": user_id,
        "name": item.name,
        "category": item.category or "food",
        "storage_condition": item.storage_condition or "fridge",
        "opened": item.opened or False,
        "purchase_date": item.purchase_date or datetime.now().date().isoformat(),
        "createdAt": datetime.now().isoformat()
    }
    
    # Use CUSTOM TRAINED MODEL for expiry prediction
    if expiry_predictor and expiry_predictor.is_trained:
        try:
            prediction = expiry_predictor.predict(
                new_item['name'],
                new_item['category'],
                new_item['storage_condition'],
                new_item['opened']
            )
            new_item.update({
                'predicted_expiry': prediction['predicted_expiry'],
                'status': prediction['status'],
                'daysUntilExpiry': prediction['predicted_days'],
                'prediction_source': 'custom_trained_model'
            })
            print(f"✅ Used CUSTOM model for {item.name}")
        except Exception as e:
            print(f"⚠️  Custom model failed, using fallback: {e}")
            new_item.update({
                'predicted_expiry': datetime.now().date().isoformat(),
                'status': 'fresh',
                'daysUntilExpiry': 7,
                'prediction_source': 'fallback'
            })
    else:
        # Fallback
        new_item.update({
            'predicted_expiry': datetime.now().date().isoformat(),
            'status': 'fresh',
            'daysUntilExpiry': 7,
            'prediction_source': 'fallback'
        })
    
    items_db[item_id] = new_item
    return new_item

@app.patch("/users/{user_id}/items/{item_id}")
async def update_item(user_id: str, item_id: str, update: ItemUpdate):
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
    item = items_db.get(item_id)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if item.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    del items_db[item_id]
    return {"message": "Item deleted successfully"}

# ============================================
# AI SUGGESTIONS (Using Custom Recipe Model)
# ============================================

@app.post("/ai-suggestions")
async def get_ai_suggestions(request: SuggestionRequest):
    """Generate suggestions using CUSTOM TRAINED recipe model"""
    
    try:
        # Try custom trained model first
        if recipe_generator and recipe_generator.is_trained:
            try:
                recipe = recipe_generator.generate(
                    request.item_name,
                    request.status
                )
                
                return {
                    "suggestion": f"🤖 Custom AI Recipe:\n\n{recipe}",
                    "source": "custom_trained_model",
                    "provider": "Your Custom Model",
                    "success": True
                }
            except Exception as e:
                print(f"⚠️  Custom recipe model failed: {e}")
        
        # Fallback to simple suggestions
        status_emoji = "✨" if "fresh" in request.status.lower() else "⚡"
        suggestion = f"{status_emoji} {request.item_name} Ideas:\n"
        suggestion += f"• Use in your next meal\n"
        suggestion += f"• Store properly\n"
        suggestion += f"• Share with others\n"
        suggestion += f"• Get creative with recipes"
        
        return {
            "suggestion": suggestion,
            "source": "fallback",
            "provider": "Basic Suggestions",
            "success": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# ANALYTICS
# ============================================

@app.get("/analytics/{user_id}")
async def get_analytics(user_id: str):
    user_items = [item for item in items_db.values() if item.get("userId") == user_id]
    
    total_items = len(user_items)
    fresh_items = len([i for i in user_items if i.get("status") == "fresh"])
    expiring_items = len([i for i in user_items if i.get("status") == "expiring soon"])
    expired_items = len([i for i in user_items if i.get("status") == "expired"])
    
    # Count custom model usage
    custom_predictions = len([i for i in user_items if i.get("prediction_source") == "custom_trained_model"])
    
    return {
        "totalItems": total_items,
        "freshItems": fresh_items,
        "expiringItems": expiring_items,
        "expiredItems": expired_items,
        "wasteReduction": f"{(fresh_items / total_items * 100) if total_items > 0 else 0:.1f}%",
        "customModelUsage": custom_predictions
    }

# ============================================
# MODEL TRAINING ENDPOINTS
# ============================================

@app.post("/train-model")
async def train_model(request: TrainRequest):
    """Train custom models via API"""
    
    if request.model_type == "expiry":
        try:
            predictor = get_predictor()
            results = predictor.train()
            return {
                "status": "success",
                "model": "expiry_predictor",
                "results": results
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    elif request.model_type == "recipe":
        try:
            generator = get_generator()
            results = generator.train(epochs=3)
            return {
                "status": "success",
                "model": "recipe_generator",
                "results": results
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    else:
        raise HTTPException(status_code=400, detail="Invalid model_type")

@app.get("/model-status")
async def model_status():
    """Check which custom models are loaded"""
    return {
        "expiry_predictor": {
            "loaded": expiry_predictor is not None,
            "trained": expiry_predictor.is_trained if expiry_predictor else False
        },
        "recipe_generator": {
            "loaded": recipe_generator is not None,
            "trained": recipe_generator.is_trained if recipe_generator else False
        }
    }

# ============================================
# ROOT & HEALTH
# ============================================

@app.get("/")
async def root():
    return {
        "name": "FoodSaver AI - Custom Trained Models",
        "version": "3.0.0",
        "status": "running",
        "backend": "Python FastAPI",
        "models": {
            "expiry_predictor": expiry_predictor.is_trained if expiry_predictor else False,
            "recipe_generator": recipe_generator.is_trained if recipe_generator else False
        },
        "features": ["auth", "items", "ai-suggestions", "analytics", "custom-training"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "custom_models": {
            "expiry": expiry_predictor.is_trained if expiry_predictor else False,
            "recipe": recipe_generator.is_trained if recipe_generator else False
        }
    }

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    
    print(f"\n{'='*60}")
    print(f"🚀 FoodSaver AI - Custom Trained Models Backend")
    print(f"{'='*60}")
    print(f"📍 Running on: http://localhost:{port}")
    print(f"📚 API Docs: http://localhost:{port}/docs")
    print(f"🤖 Model Status: http://localhost:{port}/model-status")
    print(f"{'='*60}\n")
    
    uvicorn.run(
        "main-trained:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
