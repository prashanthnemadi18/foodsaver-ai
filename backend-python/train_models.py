"""
Training Script for Custom ML Models
Run this to train your own models!
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from ml_models.expiry_predictor import ExpiryPredictor
from ml_models.recipe_generator import RecipeGenerator

def train_expiry_model():
    """Train custom expiry prediction model"""
    print("\n" + "="*70)
    print("🎓 TRAINING CUSTOM EXPIRY PREDICTION MODEL")
    print("="*70 + "\n")
    
    predictor = ExpiryPredictor()
    results = predictor.train()
    
    print("\n📊 Training Results:")
    print(f"   • Training Score: {results['train_score']:.3f}")
    print(f"   • Testing Score: {results['test_score']:.3f}")
    print(f"   • Training Samples: {results['samples']}")
    
    # Test predictions
    print("\n🧪 Testing Predictions:")
    test_cases = [
        ('apple', 'fruit', 'fridge', False),
        ('chicken', 'meat', 'fridge', False),
        ('milk', 'dairy', 'fridge', True),
        ('bread', 'grain', 'pantry', False),
    ]
    
    for name, category, storage, opened in test_cases:
        result = predictor.predict(name, category, storage, opened)
        print(f"   • {name} ({storage}): {result['predicted_days']} days - {result['status']}")
    
    return predictor

def train_recipe_model():
    """Train custom recipe generation model"""
    print("\n" + "="*70)
    print("🎓 TRAINING CUSTOM RECIPE GENERATOR MODEL")
    print("="*70 + "\n")
    
    print("⚠️  Note: This requires ~500MB download and takes 5-10 minutes")
    response = input("Continue? (y/n): ")
    
    if response.lower() != 'y':
        print("❌ Recipe model training skipped")
        return None
    
    generator = RecipeGenerator()
    results = generator.train(epochs=3)
    
    print("\n📊 Training Results:")
    print(f"   • Status: {results['status']}")
    print(f"   • Recipes trained: {results['recipes']}")
    
    # Test generation
    print("\n🧪 Testing Recipe Generation:")
    test_cases = [
        ('apple', 'fresh'),
        ('banana', 'expiring'),
        ('tomato', 'fresh'),
    ]
    
    for ingredient, status in test_cases:
        recipe = generator.generate(ingredient, status)
        print(f"\n   • {ingredient} ({status}):")
        print(f"     {recipe[:100]}...")
    
    return generator

def main():
    """Main training function"""
    print("\n" + "🤖 " + "="*66)
    print("🤖  FOODSAVER AI - CUSTOM MODEL TRAINING")
    print("🤖 " + "="*66 + "\n")
    
    print("This script will train YOUR OWN custom ML models:")
    print("1. ✅ Expiry Prediction Model (Fast - 1 minute)")
    print("2. 🤖 Recipe Generator Model (Slow - 10 minutes)")
    print()
    
    # Train Expiry Model
    print("Starting with Expiry Prediction Model...")
    try:
        predictor = train_expiry_model()
        print("\n✅ Expiry model trained successfully!")
    except Exception as e:
        print(f"\n❌ Expiry model training failed: {e}")
        predictor = None
    
    # Ask about Recipe Model
    print("\n" + "-"*70)
    train_recipe = input("\nTrain Recipe Generator Model? (y/n): ")
    
    if train_recipe.lower() == 'y':
        try:
            generator = train_recipe_model()
            print("\n✅ Recipe model trained successfully!")
        except Exception as e:
            print(f"\n❌ Recipe model training failed: {e}")
            generator = None
    else:
        print("⏭️  Recipe model training skipped")
        generator = None
    
    # Summary
    print("\n" + "="*70)
    print("🎉 TRAINING COMPLETE!")
    print("="*70)
    print("\n📊 Summary:")
    print(f"   • Expiry Model: {'✅ Trained' if predictor else '❌ Failed'}")
    print(f"   • Recipe Model: {'✅ Trained' if generator else '⏭️ Skipped'}")
    
    print("\n🚀 Next Steps:")
    print("   1. Run: uvicorn main-trained:app --reload --port 8000")
    print("   2. Your custom models will be used automatically!")
    print("   3. Models saved in: ml_models/saved_models/")
    
    print("\n💡 To retrain: python train_models.py")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
