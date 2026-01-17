# 🤖 ML Service Setup Guide
## HuggingFace Transformers + spaCy + PyTorch + Scikit-learn

Complete guide to set up advanced AI capabilities for FoodSaver AI.

---

## 📋 Prerequisites

### 1. Python 3.9+
Check if Python is installed:
```cmd
python --version
```

If not installed, download from: https://www.python.org/downloads/

**Important**: During installation, check "Add Python to PATH"

### 2. Node.js (Already installed)
You already have this for the Express backend.

---

## 🚀 Quick Start (Easiest)

### Option 1: Automated Setup
Just run:
```cmd
START-WITH-ML.bat
```

This will:
1. Create Python virtual environment
2. Install all ML dependencies
3. Download spaCy model
4. Start all services (Python ML + Express + React)

### Option 2: Manual Setup

#### Step 1: Setup Python Environment
```cmd
cd backend-python
python -m venv venv
venv\Scripts\activate
```

#### Step 2: Install Dependencies
```cmd
pip install -r requirements.txt
```

This installs:
- ✅ **transformers** (4.35.2) - HuggingFace models
- ✅ **torch** (2.1.0) - PyTorch deep learning
- ✅ **spacy** (3.7.2) - NLP and NER
- ✅ **scikit-learn** (1.3.2) - ML algorithms
- ✅ **fastapi** - High-performance API

#### Step 3: Download spaCy Model
```cmd
python -m spacy download en_core_web_sm
```

#### Step 4: Start Python ML Service
```cmd
python main.py
```

Service will start on: http://localhost:8001

#### Step 5: Start Express Backend
Open new terminal:
```cmd
cd backend-express
npm start
```

#### Step 6: Start React Frontend
Open new terminal:
```cmd
cd frontend
npm run dev
```

---

## 🧪 Testing the ML Service

### Test 1: Health Check
```cmd
curl http://localhost:8001/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": {
    "huggingface_transformers": true,
    "spacy_ner": true,
    "sentiment_analysis": true,
    "scikit_learn": true
  }
}
```

### Test 2: Get AI Suggestion
```cmd
curl -X POST http://localhost:8001/ai-suggestions ^
  -H "Content-Type: application/json" ^
  -d "{\"item_name\":\"Apple\",\"category\":\"Fruit\",\"status\":\"Fresh\"}"
```

### Test 3: Check Integration
```cmd
curl http://localhost:8000/ai-suggestions/health
```

Should show Python ML Service as priority 1.

---

## 📊 What Each Library Does

### 1. HuggingFace Transformers
- **Purpose**: Advanced text generation
- **Model**: distilgpt2 (lightweight, fast)
- **Use**: Generate creative food suggestions
- **Size**: ~350MB

### 2. spaCy
- **Purpose**: Named Entity Recognition (NER)
- **Model**: en_core_web_sm
- **Use**: Extract food names, categories, entities
- **Size**: ~12MB

### 3. PyTorch
- **Purpose**: Deep learning backend
- **Use**: Powers Transformers models
- **Size**: ~200MB

### 4. Scikit-learn
- **Purpose**: Traditional ML algorithms
- **Use**: Find similar items, classification
- **Size**: ~30MB

---

## 🔄 AI Provider Priority

The system tries providers in this order:

1. **Python ML Service** (BEST)
   - HuggingFace Transformers
   - spaCy NER
   - PyTorch backend
   - Scikit-learn algorithms
   - ✅ FREE, runs locally
   - ✅ No API keys needed
   - ✅ Advanced ML capabilities

2. **Google Gemini**
   - Fast, free API
   - Requires API key
   - Good quality

3. **OpenAI GPT**
   - Highest quality
   - Requires paid API key
   - Most expensive

4. **Smart Fallback**
   - Local knowledge base
   - Always available
   - No dependencies

---

## 💡 Benefits of ML Service

### Without ML Service:
- Basic suggestions from knowledge base
- Limited creativity
- No entity recognition
- No sentiment analysis

### With ML Service:
- ✅ AI-generated creative suggestions
- ✅ Named entity recognition
- ✅ Sentiment analysis
- ✅ Similar item detection
- ✅ Advanced NLP capabilities
- ✅ Runs completely offline
- ✅ No API costs

---

## 🐛 Troubleshooting

### Issue: Python not found
**Solution**: Install Python 3.9+ and add to PATH

### Issue: pip not found
**Solution**: 
```cmd
python -m ensurepip --upgrade
```

### Issue: spaCy model not found
**Solution**:
```cmd
python -m spacy download en_core_web_sm
```

### Issue: PyTorch installation slow
**Solution**: Use CPU-only version (smaller, faster):
```cmd
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

### Issue: Out of memory
**Solution**: The models need ~500MB RAM. Close other applications or:
1. Use smaller models
2. Disable unused models in `main.py`

### Issue: Port 8001 already in use
**Solution**: Change port in `backend-python/.env`:
```env
PYTHON_PORT=8002
```

Also update in `backend-express/.env`:
```env
PYTHON_ML_SERVICE=http://localhost:8002
```

---

## 📈 Performance

### First Run:
- Downloads models (~600MB)
- Takes 2-5 minutes
- Models are cached

### Subsequent Runs:
- Uses cached models
- Starts in 10-30 seconds
- Fast inference

### Response Times:
- Transformers: 500-2000ms
- spaCy NER: 10-50ms
- Sentiment: 100-300ms
- Fallback: <10ms

---

## 🔒 Privacy & Security

- ✅ All models run **locally**
- ✅ No data sent to external servers
- ✅ No API keys required (for ML service)
- ✅ Complete privacy
- ✅ Works offline

---

## 📚 API Documentation

Once running, visit:
- **Interactive Docs**: http://localhost:8001/docs
- **Alternative Docs**: http://localhost:8001/redoc

---

## 🎯 Next Steps

1. Run `START-WITH-ML.bat`
2. Wait for models to download (first time only)
3. Open http://localhost:5173
4. Try AI suggestions - they'll use ML models!
5. Check console logs to see which provider is used

---

## ✨ Summary

You now have:
- ✅ HuggingFace Transformers for text generation
- ✅ spaCy for entity recognition
- ✅ PyTorch for deep learning
- ✅ Scikit-learn for ML algorithms
- ✅ FastAPI for high-performance API
- ✅ Complete offline AI capabilities
- ✅ No API costs

**Enjoy your advanced AI-powered FoodSaver application!** 🚀
