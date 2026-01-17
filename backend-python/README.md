# FoodSaver AI - Python ML Service

Advanced AI suggestions using:
- **HuggingFace Transformers** (v4.35.2) - Text generation
- **spaCy** (en_core_web_sm) - Named Entity Recognition
- **PyTorch** (v2.1.0) - Deep learning backend
- **Scikit-learn** (v1.3.2) - ML algorithms
- **FastAPI** - High-performance API framework

## 🚀 Quick Setup

### 1. Install Python 3.9+
Make sure you have Python 3.9 or higher installed:
```bash
python --version
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download spaCy Model
```bash
python -m spacy download en_core_web_sm
```

### 5. Configure Environment
Create `.env` file:
```env
PYTHON_PORT=8001
```

### 6. Run the Service
```bash
python main.py
```

The service will start on: http://localhost:8001

## 📚 API Documentation

Once running, visit:
- **Interactive Docs**: http://localhost:8001/docs
- **Alternative Docs**: http://localhost:8001/redoc

## 🔌 Endpoints

### POST /ai-suggestions
Generate AI-powered food suggestions

**Request:**
```json
{
  "item_name": "Apple",
  "category": "Fruit",
  "status": "Fresh",
  "storage_condition": "fridge"
}
```

**Response:**
```json
{
  "suggestion": "🤖 AI-Generated Ideas:\n...",
  "source": "transformers",
  "provider": "HuggingFace Transformers",
  "success": true
}
```

### POST /analyze
Analyze text with spaCy NER and sentiment analysis

**Request:**
```json
{
  "text": "I have fresh apples and bananas"
}
```

### POST /similarity
Find similar food items using ML

**Request:**
```json
{
  "item_name": "apple"
}
```

## 🧪 Testing

Test the service:
```bash
# Health check
curl http://localhost:8001/health

# Get suggestion
curl -X POST http://localhost:8001/ai-suggestions \
  -H "Content-Type: application/json" \
  -d '{"item_name":"Apple","category":"Fruit","status":"Fresh"}'
```

## 🔧 Troubleshooting

### spaCy model not found
```bash
python -m spacy download en_core_web_sm
```

### PyTorch installation issues
```bash
# CPU version (smaller, faster install)
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

### Memory issues
The models require ~500MB RAM. If you have limited memory:
1. Use smaller models
2. Disable unused models in main.py

## 📊 Model Information

| Model | Size | Purpose |
|-------|------|---------|
| distilgpt2 | ~350MB | Text generation |
| en_core_web_sm | ~12MB | NER, POS tagging |
| sentiment-analysis | ~250MB | Sentiment detection |

## 🚀 Production Deployment

For production:
1. Use gunicorn instead of uvicorn
2. Enable model caching
3. Use GPU if available
4. Implement rate limiting

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📝 Notes

- First run will download models (~600MB total)
- Models are cached for faster subsequent starts
- CPU inference is used by default (no GPU required)
- All models run locally (no external API calls)
