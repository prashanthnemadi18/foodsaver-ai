"""
Quick Training Script - Expiry Model Only
Train just the expiry prediction model (fast - 1 minute)
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from ml_models.expiry_predictor import ExpiryPredictor

def main():
    """Train expiry model only"""
    print("\n" + "🤖 " + "="*66)
    print("🤖  FOODSAVER AI - EXPIRY MODEL TRAINING")
    print("🤖 " + "="*66 + "\n")
    
    print("Training Custom Expiry Prediction Model...")
    print("This will take about 1 minute.\n")
    
    try:
        predictor = ExpiryPredictor()
        results = predictor.train()
        
        print("\n" + "="*70)
        print("✅ TRAINING COMPLETE!")
        print("="*70)
        print("\n📊 Results:")
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
        
        print("\n" + "="*70)
        print("🎉 SUCCESS!")
        print("="*70)
        print("\n🚀 Next Steps:")
        print("   1. Run: uvicorn main-trained:app --reload --port 8000")
        print("   2. Your custom model will be used automatically!")
        print("   3. Model saved in: ml_models/saved_models/")
        print("\n💡 To retrain: python train_expiry_only.py")
        print("="*70 + "\n")
        
    except Exception as e:
        print(f"\n❌ Training failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
