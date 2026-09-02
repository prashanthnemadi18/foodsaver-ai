"""
Custom Expiry Prediction Model
Train your own model on food expiry data
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os
from datetime import datetime, timedelta

class ExpiryPredictor:
    """Custom trained model for predicting food expiry dates"""
    
    def __init__(self):
        self.model = None
        self.category_encoder = LabelEncoder()
        self.storage_encoder = LabelEncoder()
        self.is_trained = False
        self.model_path = "ml_models/saved_models/expiry_model.pkl"
        
    def create_training_data(self):
        """
        Create training dataset from food expiry knowledge
        This is YOUR custom dataset!
        """
        
        # Custom Food Expiry Dataset (You can expand this!)
        training_data = []
        
        # Fruits
        fruits = [
            ('apple', 'fruit', 'fridge', False, 7),
            ('apple', 'fruit', 'pantry', False, 3),
            ('apple', 'fruit', 'fridge', True, 4),
            ('banana', 'fruit', 'pantry', False, 5),
            ('banana', 'fruit', 'fridge', False, 7),
            ('banana', 'fruit', 'pantry', True, 2),
            ('orange', 'fruit', 'fridge', False, 14),
            ('orange', 'fruit', 'pantry', False, 7),
            ('strawberry', 'fruit', 'fridge', False, 3),
            ('strawberry', 'fruit', 'fridge', True, 2),
            ('grapes', 'fruit', 'fridge', False, 7),
            ('grapes', 'fruit', 'fridge', True, 4),
            ('watermelon', 'fruit', 'fridge', False, 7),
            ('watermelon', 'fruit', 'fridge', True, 3),
            ('pineapple', 'fruit', 'fridge', False, 5),
            ('mango', 'fruit', 'fridge', False, 5),
            ('kiwi', 'fruit', 'fridge', False, 7),
        ]
        
        # Vegetables
        vegetables = [
            ('carrot', 'vegetable', 'fridge', False, 21),
            ('carrot', 'vegetable', 'pantry', False, 7),
            ('tomato', 'vegetable', 'pantry', False, 5),
            ('tomato', 'vegetable', 'fridge', False, 10),
            ('tomato', 'vegetable', 'fridge', True, 5),
            ('lettuce', 'vegetable', 'fridge', False, 7),
            ('lettuce', 'vegetable', 'fridge', True, 3),
            ('potato', 'vegetable', 'pantry', False, 30),
            ('potato', 'vegetable', 'fridge', False, 60),
            ('onion', 'vegetable', 'pantry', False, 30),
            ('onion', 'vegetable', 'fridge', False, 45),
            ('broccoli', 'vegetable', 'fridge', False, 7),
            ('broccoli', 'vegetable', 'fridge', True, 3),
            ('cucumber', 'vegetable', 'fridge', False, 7),
            ('cucumber', 'vegetable', 'fridge', True, 4),
            ('spinach', 'vegetable', 'fridge', False, 5),
            ('bell_pepper', 'vegetable', 'fridge', False, 7),
        ]
        
        # Dairy
        dairy = [
            ('milk', 'dairy', 'fridge', False, 7),
            ('milk', 'dairy', 'fridge', True, 3),
            ('cheese', 'dairy', 'fridge', False, 21),
            ('cheese', 'dairy', 'fridge', True, 14),
            ('cheese', 'dairy', 'freezer', False, 180),
            ('yogurt', 'dairy', 'fridge', False, 14),
            ('yogurt', 'dairy', 'fridge', True, 7),
            ('butter', 'dairy', 'fridge', False, 30),
            ('butter', 'dairy', 'freezer', False, 180),
            ('cream', 'dairy', 'fridge', False, 7),
            ('cream', 'dairy', 'fridge', True, 3),
            ('sour_cream', 'dairy', 'fridge', False, 14),
        ]
        
        # Meat
        meat = [
            ('chicken', 'meat', 'fridge', False, 2),
            ('chicken', 'meat', 'freezer', False, 180),
            ('chicken', 'meat', 'fridge', True, 1),
            ('beef', 'meat', 'fridge', False, 3),
            ('beef', 'meat', 'freezer', False, 270),
            ('beef', 'meat', 'fridge', True, 2),
            ('fish', 'meat', 'fridge', False, 2),
            ('fish', 'meat', 'freezer', False, 90),
            ('fish', 'meat', 'fridge', True, 1),
            ('pork', 'meat', 'fridge', False, 3),
            ('pork', 'meat', 'freezer', False, 180),
            ('turkey', 'meat', 'fridge', False, 2),
            ('turkey', 'meat', 'freezer', False, 180),
        ]
        
        # Grains
        grains = [
            ('bread', 'grain', 'pantry', False, 7),
            ('bread', 'grain', 'freezer', False, 90),
            ('bread', 'grain', 'pantry', True, 3),
            ('rice', 'grain', 'pantry', False, 365),
            ('rice', 'grain', 'pantry', True, 180),
            ('pasta', 'grain', 'pantry', False, 730),
            ('pasta', 'grain', 'pantry', True, 365),
            ('cereal', 'grain', 'pantry', False, 180),
            ('cereal', 'grain', 'pantry', True, 90),
            ('flour', 'grain', 'pantry', False, 180),
            ('oats', 'grain', 'pantry', False, 365),
        ]
        
        # Combine all data
        all_data = fruits + vegetables + dairy + meat + grains
        
        # Create DataFrame
        df = pd.DataFrame(all_data, columns=[
            'name', 'category', 'storage', 'opened', 'days_until_expiry'
        ])
        
        return df
    
    def prepare_features(self, df, fit=False):
        """Convert categorical data to numerical features"""
        
        # Make a copy to avoid modifying original
        df = df.copy()
        
        # Encode categories
        if fit:
            df['category_encoded'] = self.category_encoder.fit_transform(df['category'])
            df['storage_encoded'] = self.storage_encoder.fit_transform(df['storage'])
        else:
            df['category_encoded'] = self.category_encoder.transform(df['category'])
            df['storage_encoded'] = self.storage_encoder.transform(df['storage'])
        
        # Convert opened to int
        df['opened_int'] = df['opened'].astype(int)
        
        # Add interaction features for better predictions
        df['category_storage_interaction'] = df['category_encoded'] * df['storage_encoded']
        df['storage_opened_interaction'] = df['storage_encoded'] * df['opened_int']
        
        # Features for training - now with more information
        X = df[['category_encoded', 'storage_encoded', 'opened_int', 
                'category_storage_interaction', 'storage_opened_interaction']]
        y = df['days_until_expiry'] if 'days_until_expiry' in df.columns else None
        
        return X, y
    
    def train(self):
        """Train the custom model"""
        
        print("🎓 Training Custom Expiry Prediction Model...")
        print("=" * 60)
        
        # Create training data
        df = self.create_training_data()
        print(f"📊 Training samples: {len(df)}")
        print(f"📦 Categories: {df['category'].unique()}")
        print(f"🏪 Storage types: {df['storage'].unique()}")
        
        # Prepare features
        X, y = self.prepare_features(df, fit=True)
        
        # Split data (smaller test size due to limited data)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.15, random_state=42, shuffle=True
        )
        
        # Train model with better parameters for small datasets
        print("\n🤖 Training Random Forest model...")
        self.model = RandomForestRegressor(
            n_estimators=100,           # More trees for better predictions
            max_depth=10,               # Deeper trees
            min_samples_split=2,
            min_samples_leaf=1,
            max_features='sqrt',        # Use sqrt of features
            random_state=42,
            n_jobs=-1,
            bootstrap=True              # Enable bootstrap sampling
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"✅ Training Score: {train_score:.3f}")
        print(f"✅ Testing Score: {test_score:.3f}")
        
        # Warning if test score is poor
        if test_score < 0:
            print(f"⚠️  Warning: Negative test score indicates overfitting")
            print(f"   Model may still work but consider adding more training data")
        
        self.is_trained = True
        
        # Save model
        self.save_model()
        
        print(f"\n🎉 Model trained successfully!")
        print("=" * 60)
        
        return {
            'train_score': train_score,
            'test_score': test_score,
            'samples': len(df)
        }
    
    def predict(self, name, category, storage, opened=False):
        """Predict expiry days for a food item"""
        
        if not self.is_trained and not self.load_model():
            raise Exception("Model not trained! Run train() first.")
        
        # Create input DataFrame
        input_df = pd.DataFrame([{
            'name': name,
            'category': category,
            'storage': storage,
            'opened': opened
        }])
        
        # Prepare features
        X, _ = self.prepare_features(input_df, fit=False)
        
        # Predict
        days = int(self.model.predict(X)[0])
        
        # Calculate dates
        purchase_date = datetime.now()
        expiry_date = purchase_date + timedelta(days=days)
        
        # Determine status
        if days < 0:
            status = 'expired'
        elif days <= 3:
            status = 'expiring soon'
        else:
            status = 'fresh'
        
        return {
            'predicted_days': days,
            'predicted_expiry': expiry_date.date().isoformat(),
            'status': status,
            'purchase_date': purchase_date.date().isoformat()
        }
    
    def save_model(self):
        """Save trained model to disk"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        
        model_data = {
            'model': self.model,
            'category_encoder': self.category_encoder,
            'storage_encoder': self.storage_encoder
        }
        
        joblib.dump(model_data, self.model_path)
        print(f"💾 Model saved to: {self.model_path}")
    
    def load_model(self):
        """Load trained model from disk"""
        if os.path.exists(self.model_path):
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.category_encoder = model_data['category_encoder']
            self.storage_encoder = model_data['storage_encoder']
            self.is_trained = True
            print(f"✅ Model loaded from: {self.model_path}")
            return True
        return False


# Singleton instance
_predictor = None

def get_predictor():
    """Get or create predictor instance"""
    global _predictor
    if _predictor is None:
        _predictor = ExpiryPredictor()
        _predictor.load_model()  # Try to load existing model
    return _predictor
