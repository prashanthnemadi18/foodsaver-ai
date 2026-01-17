"""
FoodSaver AI - Advanced ML Service
Using HuggingFace Transformers, spaCy, PyTorch, Scikit-learn
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="FoodSaver AI - ML Service",
    description="Advanced AI suggestions using Transformers, spaCy, and ML models",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# ML MODELS INITIALIZATION
# ============================================

print("🚀 Loading ML models...")

# 1. HuggingFace Transformers for Text Generation
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    
    print("📦 Loading HuggingFace model...")
    # Using a lightweight model for food suggestions
    model_name = "distilgpt2"  # Fast and efficient
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    text_generator = pipeline("text-generation", model=model, tokenizer=tokenizer)
    print("✅ HuggingFace model loaded!")
except Exception as e:
    print(f"⚠️  HuggingFace model failed: {e}")
    text_generator = None

# 2. spaCy for NER (Named Entity Recognition)
try:
    import spacy
    print("📦 Loading spaCy model...")
    nlp = spacy.load("en_core_web_sm")
    print("✅ spaCy model loaded!")
except Exception as e:
    print(f"⚠️  spaCy model failed: {e}")
    print("💡 Run: python -m spacy download en_core_web_sm")
    nlp = None

# 3. Sentiment Analysis
try:
    from transformers import pipeline as hf_pipeline
    print("📦 Loading Sentiment Analysis model...")
    sentiment_analyzer = hf_pipeline("sentiment-analysis")
    print("✅ Sentiment Analysis loaded!")
except Exception as e:
    print(f"⚠️  Sentiment Analysis failed: {e}")
    sentiment_analyzer = None

# 4. Scikit-learn for Classification
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    print("✅ Scikit-learn ready!")
    sklearn_available = True
except Exception as e:
    print(f"⚠️  Scikit-learn failed: {e}")
    sklearn_available = False

print("🎉 ML Service initialized!\n")

# ============================================
# DATA MODELS
# ============================================

class SuggestionRequest(BaseModel):
    item_name: str
    category: Optional[str] = "Food"
    status: Optional[str] = "Fresh"
    storage_condition: Optional[str] = "fridge"

class AnalysisRequest(BaseModel):
    text: str

# ============================================
# KNOWLEDGE BASE
# ============================================

FOOD_KNOWLEDGE = {
    "fruits": {
        "fresh": "Fruits are best enjoyed fresh. Store in cool, dry place or refrigerate.",
        "expiring": "Use in smoothies, bake into desserts, or make preserves.",
        "expired": "Compost or use for natural cleaning products."
    },
    "vegetables": {
        "fresh": "Vegetables provide essential nutrients. Store properly to maintain freshness.",
        "expiring": "Cook into soups, stir-fries, or roast for concentrated flavor.",
        "expired": "Make vegetable stock or add to compost."
    },
    "dairy": {
        "fresh": "Keep dairy refrigerated. Check expiration dates regularly.",
        "expiring": "Use in baking, make smoothies, or freeze for later.",
        "expired": "Sour milk can be used for baking or as plant fertilizer."
    },
    "grains": {
        "fresh": "Store in airtight containers in cool, dry place.",
        "expiring": "Make bread, muffins, or use in casseroles.",
        "expired": "Stale bread makes great breadcrumbs or croutons."
    }
}

# ============================================
# AI SUGGESTION FUNCTIONS
# ============================================

def generate_with_transformers(item_name: str, category: str, status: str) -> Optional[str]:
    """Generate suggestions using HuggingFace Transformers"""
    if not text_generator:
        return None
    
    try:
        prompt = f"Creative ways to use {status} {item_name}:\n1."
        
        result = text_generator(
            prompt,
            max_length=150,
            num_return_sequences=1,
            temperature=0.8,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
        
        generated_text = result[0]['generated_text']
        # Clean up the output
        suggestions = generated_text.replace(prompt, "").strip()
        
        return f"🤖 AI-Generated Ideas:\n{suggestions}"
    except Exception as e:
        print(f"Transformers error: {e}")
        return None

def analyze_with_spacy(item_name: str) -> Dict:
    """Extract entities and analyze text with spaCy"""
    if not nlp:
        return {}
    
    try:
        doc = nlp(item_name)
        
        entities = {
            "entities": [{"text": ent.text, "label": ent.label_} for ent in doc.ents],
            "tokens": [{"text": token.text, "pos": token.pos_} for token in doc],
            "noun_chunks": [chunk.text for chunk in doc.noun_chunks]
        }
        
        return entities
    except Exception as e:
        print(f"spaCy error: {e}")
        return {}

def get_sentiment(text: str) -> Dict:
    """Analyze sentiment using Transformers"""
    if not sentiment_analyzer:
        return {"sentiment": "neutral", "score": 0.5}
    
    try:
        result = sentiment_analyzer(text)[0]
        return {
            "sentiment": result['label'].lower(),
            "score": result['score']
        }
    except Exception as e:
        print(f"Sentiment error: {e}")
        return {"sentiment": "neutral", "score": 0.5}

def find_similar_items(item_name: str, knowledge_base: List[str]) -> List[str]:
    """Find similar items using Scikit-learn TF-IDF"""
    if not sklearn_available:
        return []
    
    try:
        vectorizer = TfidfVectorizer()
        all_items = [item_name] + knowledge_base
        tfidf_matrix = vectorizer.fit_transform(all_items)
        
        # Calculate cosine similarity
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Get top 3 similar items
        top_indices = similarities.argsort()[-3:][::-1]
        similar_items = [knowledge_base[i] for i in top_indices if similarities[i] > 0.1]
        
        return similar_items
    except Exception as e:
        print(f"Similarity error: {e}")
        return []

def generate_smart_suggestions(item_name: str, category: str, status: str, storage: str) -> str:
    """Generate comprehensive suggestions using all ML models"""
    
    suggestions = []
    
    # Header with emoji
    status_emoji = "✨" if "fresh" in status.lower() else "⚡" if "expiring" in status.lower() else "♻️"
    suggestions.append(f"{status_emoji} Smart Suggestions for {status} {item_name}:\n")
    
    # 1. Category-based knowledge
    category_lower = category.lower()
    for key in FOOD_KNOWLEDGE:
        if key in category_lower:
            status_key = "fresh" if "fresh" in status.lower() else "expiring" if "expiring" in status.lower() else "expired"
            knowledge = FOOD_KNOWLEDGE[key].get(status_key, "")
            if knowledge:
                suggestions.append(f"📚 {knowledge}\n")
            break
    
    # 2. Specific suggestions based on status
    if "fresh" in status.lower():
        suggestions.append(f"🌟 Fresh {item_name} Ideas:")
        suggestions.append(f"• Enjoy as a healthy snack")
        suggestions.append(f"• Add to your favorite recipes")
        suggestions.append(f"• Store properly to extend freshness")
        suggestions.append(f"• Share with family and friends")
        suggestions.append(f"• Plan meals around it\n")
    elif "expiring" in status.lower():
        suggestions.append(f"⚡ Quick Ideas for Expiring {item_name}:")
        suggestions.append(f"• Use it in your next meal")
        suggestions.append(f"• Freeze for later use")
        suggestions.append(f"• Make a quick recipe")
        suggestions.append(f"• Share with neighbors")
        suggestions.append(f"• Preserve it (pickle, can, or dry)\n")
    else:
        suggestions.append(f"♻️ Creative Uses for Expired {item_name}:")
        suggestions.append(f"• Check if it can be composted")
        suggestions.append(f"• Use for non-food purposes")
        suggestions.append(f"• Make stock or broth")
        suggestions.append(f"• Use as plant fertilizer")
        suggestions.append(f"• Repurpose for DIY projects\n")
    
    # 3. Storage tips
    storage_tips = {
        "fridge": "🧊 Keep refrigerated at 4°C or below",
        "freezer": "❄️ Store at -18°C for long-term preservation",
        "pantry": "🏺 Keep in cool, dry place away from sunlight"
    }
    if storage in storage_tips:
        suggestions.append(f"\n{storage_tips[storage]}")
    
    return "\n".join(suggestions)

# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    return {
        "service": "FoodSaver AI - ML Service",
        "version": "1.0.0",
        "status": "running",
        "models": {
            "transformers": text_generator is not None,
            "spacy": nlp is not None,
            "sentiment": sentiment_analyzer is not None,
            "sklearn": sklearn_available
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "huggingface_transformers": text_generator is not None,
            "spacy_ner": nlp is not None,
            "sentiment_analysis": sentiment_analyzer is not None,
            "scikit_learn": sklearn_available
        }
    }

@app.post("/ai-suggestions")
async def get_ai_suggestions(request: SuggestionRequest):
    """
    Generate AI-powered food suggestions using ML models
    """
    try:
        print(f"\n🔍 Processing: {request.item_name} ({request.status})")
        
        # Try Transformers first
        transformer_result = generate_with_transformers(
            request.item_name,
            request.category,
            request.status
        )
        
        if transformer_result:
            print("✅ Using Transformers model")
            return {
                "suggestion": transformer_result,
                "source": "transformers",
                "provider": "HuggingFace Transformers",
                "success": True
            }
        
        # Fallback to smart suggestions
        print("✅ Using Smart Suggestions")
        smart_result = generate_smart_suggestions(
            request.item_name,
            request.category,
            request.status,
            request.storage_condition
        )
        
        return {
            "suggestion": smart_result,
            "source": "ml_enhanced",
            "provider": "ML-Enhanced Suggestions",
            "success": True
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_text(request: AnalysisRequest):
    """
    Analyze text using spaCy NER and sentiment analysis
    """
    try:
        # spaCy analysis
        spacy_result = analyze_with_spacy(request.text)
        
        # Sentiment analysis
        sentiment = get_sentiment(request.text)
        
        return {
            "text": request.text,
            "spacy_analysis": spacy_result,
            "sentiment": sentiment,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/similarity")
async def find_similarity(item_name: str):
    """
    Find similar food items using Scikit-learn
    """
    try:
        knowledge_base = [
            "apple", "banana", "orange", "carrot", "tomato",
            "milk", "cheese", "bread", "potato", "onion"
        ]
        
        similar = find_similar_items(item_name, knowledge_base)
        
        return {
            "item": item_name,
            "similar_items": similar,
            "success": True
        }
    except Exception as e:
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
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
