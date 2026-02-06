# 🎓 Custom ML Model Training - Quick Start

## 🎯 Why Train Custom Models?

**Pre-trained models** = Everyone has them ❌  
**YOUR trained models** = Unique & Valuable ✅

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd backend-python
pip install -r requirements.txt
```

### Step 2: Train Your Models
```bash
python train_models.py
```
**OR** double-click: `TRAIN-MODELS.bat`

### Step 3: Run with Custom Models
```bash
uvicorn main-trained:app --reload --port 8000
```
**OR** double-click: `START-WITH-CUSTOM-MODELS.bat`

---

## 📦 What Gets Trained

### 1. Expiry Prediction Model ⚡ (Fast - 1 min)
- Predicts food expiry dates
- 50+ training samples
- 89% accuracy
- YOUR custom dataset

### 2. Recipe Generator Model 🤖 (Slow - 10 min)
- Generates recipe suggestions
- Fine-tuned GPT-2
- 15+ custom recipes
- Natural language output

---

## 🎮 Training Commands

### Train Both Models
```bash
python train_models.py
```

### Train Only Expiry Model (Fast)
```python
from ml_models.expiry_predictor import ExpiryPredictor
predictor = ExpiryPredictor()
predictor.train()
```

### Train Only Recipe Model
```python
from ml_models.recipe_generator import RecipeGenerator
generator = RecipeGenerator()
generator.train(epochs=3)
```

---

## 📊 Expected Output

```
🎓 TRAINING CUSTOM EXPIRY PREDICTION MODEL
==================================================================

📊 Training samples: 50
✅ Training Score: 0.985
✅ Testing Score: 0.892

🧪 Testing Predictions:
   • apple (fridge): 7 days - fresh
   • chicken (fridge): 2 days - expiring soon

💾 Model saved to: ml_models/saved_models/expiry_model.pkl

🎉 Model trained successfully!
```

---

## 🚀 Using Your Trained Models

### Backend Files

| File | Description | Models |
|------|-------------|--------|
| `main-complete.py` | Simple (No ML) | None |
| `main.py` | Pre-trained models | ❌ Generic |
| `main-trained.py` | **YOUR models** | ✅ Custom |

### Run Custom Backend
```bash
uvicorn main-trained:app --reload --port 8000
```

### Check Model Status
Visit: http://127.0.0.1:8000/model-status

```json
{
  "expiry_predictor": {
    "loaded": true,
    "trained": true
  },
  "recipe_generator": {
    "loaded": true,
    "trained": true
  }
}
```

---

## 📁 Files Created

```
backend-python/
├── ml_models/
│   ├── expiry_predictor.py      # Expiry model code
│   ├── recipe_generator.py      # Recipe model code
│   └── saved_models/            # YOUR TRAINED MODELS ✅
│       ├── expiry_model.pkl     # Trained expiry model
│       └── recipe_model/        # Trained recipe model
└── train_models.py              # Training script
```

---

## 🎯 Expand Your Training Data

### Add More Foods (Expiry Model)

Edit `ml_models/expiry_predictor.py` line ~50:

```python
# Add your foods here!
custom_foods = [
    ('mango', 'fruit', 'fridge', False, 5),
    ('spinach', 'vegetable', 'fridge', False, 3),
    # (name, category, storage, opened, days_until_expiry)
]
```

### Add More Recipes (Recipe Model)

Edit `ml_models/recipe_generator.py` line ~60:

```python
# Add your recipes here!
{
    'ingredient': 'mango',
    'status': 'fresh',
    'recipe': 'Your recipe ideas here...'
},
```

**Then retrain**: `python train_models.py`

---

## 🔬 Test Your Models

### Python Console
```python
# Test Expiry Model
from ml_models.expiry_predictor import get_predictor
predictor = get_predictor()
result = predictor.predict('apple', 'fruit', 'fridge', False)
print(result)

# Test Recipe Model
from ml_models.recipe_generator import get_generator
generator = get_generator()
recipe = generator.generate('banana', 'expiring')
print(recipe)
```

### API Endpoints
```bash
# Check model status
curl http://127.0.0.1:8000/model-status

# Train via API
curl -X POST http://127.0.0.1:8000/train-model \
  -H "Content-Type: application/json" \
  -d '{"model_type": "expiry"}'
```

---

## 💡 Tips

### Fast Training (Recommended First)
1. Train only Expiry model (1 minute)
2. Skip Recipe model initially
3. Test with Expiry model first
4. Train Recipe model later if needed

### Full Training
1. Train both models (~10 minutes)
2. Requires ~1GB disk space
3. Needs good internet (first time)
4. Best for final project

---

## 🆘 Troubleshooting

### "Module not found"
```bash
pip install -r requirements.txt
```

### "Model not trained"
```bash
python train_models.py
```

### "Out of memory" (Recipe model)
- Skip recipe model training
- Use only expiry model
- Or train with fewer epochs

### Models not loading
```bash
# Check if models exist
dir ml_models\saved_models
```

---

## 🎉 Success Checklist

- ✅ Dependencies installed
- ✅ Models trained successfully
- ✅ Models saved to disk
- ✅ Backend runs with custom models
- ✅ Model status shows "trained: true"
- ✅ Predictions use custom models

---

## 📚 Learn More

- `CUSTOM-TRAINING-GUIDE.md` - Detailed guide
- `SETUP-ML-MODELS.md` - Pre-trained vs Custom
- `ml_models/expiry_predictor.py` - Expiry model code
- `ml_models/recipe_generator.py` - Recipe model code

---

## 🚀 Quick Commands

```bash
# Install
pip install -r requirements.txt

# Train
python train_models.py

# Run
uvicorn main-trained:app --reload --port 8000

# Test
curl http://127.0.0.1:8000/model-status
```

---

## 🎯 Summary

**You're training YOUR OWN ML models!**

This makes your project:
- ✅ Unique and valuable
- ✅ Shows real ML skills
- ✅ Impressive for portfolio
- ✅ Great for interviews

**Not just using pre-trained models - TRAINING YOUR OWN!** 🚀
