"""
FoodSaver AI - Simplified ML Service
Works without complex dependencies
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
import random

# Initialize FastAPI
app = FastAPI(
    title="FoodSaver AI - ML Service",
    description="AI suggestions service",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 FoodSaver AI - ML Service Starting...")
print("✅ Service initialized!\n")

# ============================================
# DATA MODELS
# ============================================

class SuggestionRequest(BaseModel):
    item_name: str
    category: Optional[str] = "Food"
    status: Optional[str] = "Fresh"
    storage_condition: Optional[str] = "fridge"

# ============================================
# KNOWLEDGE BASE
# ============================================

FOOD_SUGGESTIONS = {
    "apple": {
        "fresh": "🍎 Fresh Apple Ideas:\n• Slice with peanut butter for protein\n• Add to oatmeal with cinnamon\n• Make Waldorf salad\n• Bake apple muffins\n• Enjoy as healthy snack",
        "expiring": "🍎 Quick Apple Recipes:\n• Fresh apple juice or cider\n• Classic apple pie or crisp\n• Homemade applesauce\n• Add to smoothies\n• Roast with pork",
        "expired": "🍎 Soft Apple Uses:\n• Applesauce or apple butter\n• Apple pie filling\n• Apple cider vinegar\n• Dehydrate into chips\n• Compost for soil"
    },
    "banana": {
        "fresh": "🍌 Fresh Banana Ideas:\n• Breakfast cereal topping\n• Protein shake ingredient\n• Toast with honey\n• Portable snack\n• Yogurt parfait",
        "expiring": "🍌 Ripe Banana Recipes:\n• Freeze for smoothies\n• Banana bread or muffins\n• Pancake batter\n• Nice cream\n• Banana pancakes",
        "expired": "🍌 Overripe Banana Magic:\n• Moist banana bread\n• Banana ice cream\n• Natural face mask\n• Smoothie sweetener\n• Fluffy pancakes"
    },
    "milk": {
        "fresh": "🥛 Fresh Milk Ideas:\n• Drink with meals\n• Coffee or tea\n• Smoothies\n• Cereal\n• Hot chocolate",
        "expiring": "🥛 Quick Milk Uses:\n• Smoothies or milkshakes\n• Bake cakes or muffins\n• Hot chocolate\n• Homemade yogurt\n• Creamy soups",
        "expired": "🥛 Sour Milk Uses:\n• Make cheese or paneer\n• Buttermilk for baking\n• Face mask\n• Water plants (diluted)\n• Milk bath"
    },
    "carrot": {
        "fresh": "🥕 Fresh Carrot Ideas:\n• Raw with hummus\n• Carrot sticks snacks\n• Fresh salads\n• Juice for vitamins\n• Roast with herbs",
        "expiring": "🥕 Quick Carrot Recipes:\n• Carrot soup or stew\n• Carrot cake or muffins\n• Roast with honey\n• Fresh juice\n• Stir-fries",
        "expired": "🥕 Soft Carrot Uses:\n• Creamy carrot soup\n• Moist carrot cake\n• Juice for nutrition\n• Pet food (if safe)\n• Compost"
    },
    "tomato": {
        "fresh": "🍅 Fresh Tomato Ideas:\n• Slice for sandwiches\n• Fresh salads\n• Bruschetta topping\n• With mozzarella\n• Fresh salsa",
        "expiring": "🍅 Quick Tomato Recipes:\n• Fresh salsa\n• Pasta sauce\n• Tomato soup\n• Roast for flavor\n• Tomato juice",
        "expired": "🍅 Soft Tomato Uses:\n• Tomato sauce or paste\n• Delicious soup\n• Salsa or chutney\n• Roasted tomatoes\n• Compost"
    }
}

CATEGORY_SUGGESTIONS = {
    "fruit": {
        "fresh": "🍎 Fresh Fruit Ideas:\n• Enjoy as healthy snack\n• Add to breakfast bowls\n• Make fresh juice\n• Use in salads\n• Pack for lunch",
        "expiring": "🍎 Quick Fruit Recipes:\n• Make fresh juice\n• Add to smoothies\n• Bake into desserts\n• Freeze for later\n• Make fruit salad",
        "expired": "🍎 Overripe Fruit Uses:\n• Make jam or preserves\n• Blend into smoothies\n• Bake into desserts\n• Dehydrate\n• Compost"
    },
    "vegetable": {
        "fresh": "🥕 Fresh Vegetable Ideas:\n• Eat raw with dip\n• Add to salads\n• Use in cooking\n• Make juice\n• Store properly",
        "expiring": "🥕 Quick Vegetable Recipes:\n• Stir-fry or curry\n• Roast with oil\n• Add to soups\n• Make juice\n• Freeze",
        "expired": "🥕 Old Vegetable Uses:\n• Vegetable soup\n• Roast for flavor\n• Make stock\n• Compost\n• Long-cooked dishes"
    },
    "dairy": {
        "fresh": "🥛 Fresh Dairy Ideas:\n• Enjoy with meals\n• Use in coffee/tea\n• Make smoothies\n• Use in cereal\n• Store properly",
        "expiring": "🥛 Quick Dairy Uses:\n• Use in smoothies\n• Bake cakes\n• Make sauces\n• Freeze\n• Use in cooking",
        "expired": "🥛 Expired Dairy Uses:\n• Use in baking\n• Make cheese\n• Plant fertilizer\n• Face masks\n• Compost"
    }
}

# ============================================
# AI SUGGESTION FUNCTIONS
# ============================================

def generate_smart_suggestion(item_name: str, category: str, status: str, storage: str) -> str:
    """Generate smart suggestions based on item and status"""
    
    item_lower = item_name.lower()
    status_lower = status.lower()
    category_lower = category.lower()
    
    # Determine status key
    if "expired" in status_lower:
        status_key = "expired"
    elif "expiring" in status_lower:
        status_key = "expiring"
    else:
        status_key = "fresh"
    
    # Try exact match first
    for key, suggestions in FOOD_SUGGESTIONS.items():
        if key in item_lower:
            return suggestions[status_key]
    
    # Try category match
    for key, suggestions in CATEGORY_SUGGESTIONS.items():
        if key in category_lower:
            return suggestions[status_key]
    
    # Generic fallback
    status_emoji = "✨" if status_key == "fresh" else "⚡" if status_key == "expiring" else "♻️"
    
    if status_key == "fresh":
        return f"{status_emoji} Fresh {item_name} Ideas:\n• Enjoy as healthy snack\n• Use in your favorite recipes\n• Store properly\n• Share with family\n• Plan meals around it"
    elif status_key == "expiring":
        return f"{status_emoji} Quick {item_name} Ideas:\n• Use in next meal\n• Freeze for later\n• Make quick recipe\n• Share with neighbors\n• Preserve it"
    else:
        return f"{status_emoji} Creative {item_name} Uses:\n• Check if compostable\n• Use for non-food purposes\n• Make stock or broth\n• Use as fertilizer\n• Repurpose for DIY"

# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    return {
        "service": "FoodSaver AI - ML Service",
        "version": "1.0.0",
        "status": "running",
        "mode": "simplified"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mode": "simplified",
        "ready": True
    }

@app.post("/ai-suggestions")
async def get_ai_suggestions(request: SuggestionRequest):
    """Generate AI-powered food suggestions"""
    try:
        print(f"\n🔍 Processing: {request.item_name} ({request.status})")
        
        suggestion = generate_smart_suggestion(
            request.item_name,
            request.category,
            request.status,
            request.storage_condition
        )
        
        print("✅ Suggestion generated")
        
        return {
            "suggestion": suggestion,
            "source": "ml_service",
            "provider": "FoodSaver ML Service",
            "success": True
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PYTHON_PORT", 8001))
    
    print(f"\n{'='*50}")
    print(f"🚀 FoodSaver AI - ML Service")
    print(f"{'='*50}")
    print(f"📍 Running on: http://localhost:{port}")
    print(f"📚 Docs: http://localhost:{port}/docs")
    print(f"{'='*50}\n")
    
    uvicorn.run(
        "main-simple:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
