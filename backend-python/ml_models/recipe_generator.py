"""
Custom Recipe Generator Model
Fine-tune GPT model on food recipes
"""

import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments
from torch.utils.data import Dataset
import json
import os

class RecipeDataset(Dataset):
    """Custom dataset for recipe training"""
    
    def __init__(self, recipes, tokenizer, max_length=256):
        self.tokenizer = tokenizer
        self.recipes = recipes
        self.max_length = max_length
    
    def __len__(self):
        return len(self.recipes)
    
    def __getitem__(self, idx):
        recipe = self.recipes[idx]
        
        # Format: "Ingredient: [name] | Status: [status] | Recipe: [recipe]"
        text = f"Ingredient: {recipe['ingredient']} | Status: {recipe['status']} | Recipe: {recipe['recipe']}"
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            max_length=self.max_length,
            padding='max_length',
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': encoding['input_ids'].flatten()
        }

class RecipeGenerator:
    """Custom trained recipe generator"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.is_trained = False
        self.model_path = "ml_models/saved_models/recipe_model"
    
    def create_training_data(self):
        """
        Create custom recipe training dataset
        YOU CAN EXPAND THIS WITH MORE RECIPES!
        """
        
        recipes = [
            # Fresh Fruits
            {
                'ingredient': 'apple',
                'status': 'fresh',
                'recipe': 'Slice fresh apples and serve with peanut butter. Add to oatmeal or yogurt. Make a fresh apple salad with walnuts and honey.'
            },
            {
                'ingredient': 'apple',
                'status': 'expiring',
                'recipe': 'Make apple pie or apple crisp. Bake apple muffins. Create homemade applesauce. Blend into smoothies.'
            },
            {
                'ingredient': 'banana',
                'status': 'fresh',
                'recipe': 'Add to cereal or smoothies. Make banana toast with honey. Slice into yogurt parfait.'
            },
            {
                'ingredient': 'banana',
                'status': 'expiring',
                'recipe': 'Bake banana bread. Make banana pancakes. Freeze for smoothies. Create nice cream by blending frozen bananas.'
            },
            
            # Vegetables
            {
                'ingredient': 'tomato',
                'status': 'fresh',
                'recipe': 'Make fresh tomato salad with mozzarella. Add to sandwiches. Create bruschetta. Slice for burgers.'
            },
            {
                'ingredient': 'tomato',
                'status': 'expiring',
                'recipe': 'Make tomato sauce or soup. Roast with olive oil and herbs. Create salsa. Make tomato chutney.'
            },
            {
                'ingredient': 'carrot',
                'status': 'fresh',
                'recipe': 'Eat raw with hummus. Add to salads. Make carrot sticks for snacking. Juice for fresh carrot juice.'
            },
            {
                'ingredient': 'carrot',
                'status': 'expiring',
                'recipe': 'Bake carrot cake or muffins. Make carrot soup. Roast with honey. Add to stir-fry.'
            },
            
            # Dairy
            {
                'ingredient': 'milk',
                'status': 'fresh',
                'recipe': 'Use in coffee or tea. Make smoothies. Pour over cereal. Create hot chocolate.'
            },
            {
                'ingredient': 'milk',
                'status': 'expiring',
                'recipe': 'Make pancakes or waffles. Bake muffins or cakes. Create rice pudding. Make yogurt or cheese.'
            },
            {
                'ingredient': 'cheese',
                'status': 'fresh',
                'recipe': 'Make cheese board with crackers. Add to sandwiches. Create cheese quesadillas. Top pizzas.'
            },
            {
                'ingredient': 'cheese',
                'status': 'expiring',
                'recipe': 'Make mac and cheese. Create cheese sauce. Bake into casseroles. Make grilled cheese sandwiches.'
            },
            
            # Meat
            {
                'ingredient': 'chicken',
                'status': 'fresh',
                'recipe': 'Grill chicken breasts. Make chicken stir-fry. Bake with herbs. Create chicken salad.'
            },
            {
                'ingredient': 'chicken',
                'status': 'expiring',
                'recipe': 'Cook immediately into soup. Make chicken curry. Bake chicken casserole. Create chicken stock.'
            },
            
            # Grains
            {
                'ingredient': 'bread',
                'status': 'fresh',
                'recipe': 'Make sandwiches. Toast with butter. Create French toast. Make garlic bread.'
            },
            {
                'ingredient': 'bread',
                'status': 'expiring',
                'recipe': 'Make breadcrumbs. Create bread pudding. Make croutons. Prepare stuffing.'
            },
        ]
        
        return recipes
    
    def train(self, epochs=3):
        """Train the recipe generation model"""
        
        print("🎓 Training Custom Recipe Generator...")
        print("=" * 60)
        
        # Load base model
        print("📦 Loading base GPT-2 model...")
        model_name = "distilgpt2"
        self.tokenizer = GPT2Tokenizer.from_pretrained(model_name)
        self.model = GPT2LMHeadModel.from_pretrained(model_name)
        
        # Set padding token
        self.tokenizer.pad_token = self.tokenizer.eos_token
        self.model.config.pad_token_id = self.tokenizer.eos_token_id
        
        # Create training data
        recipes = self.create_training_data()
        print(f"📊 Training recipes: {len(recipes)}")
        
        # Create dataset
        dataset = RecipeDataset(recipes, self.tokenizer)
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=self.model_path,
            num_train_epochs=epochs,
            per_device_train_batch_size=2,
            save_steps=10,
            save_total_limit=2,
            logging_steps=5,
            learning_rate=5e-5,
            warmup_steps=10,
        )
        
        # Trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=dataset,
        )
        
        # Train
        print("\n🤖 Fine-tuning model on custom recipes...")
        trainer.train()
        
        # Save
        self.save_model()
        self.is_trained = True
        
        print(f"\n🎉 Recipe model trained successfully!")
        print("=" * 60)
        
        return {'status': 'success', 'recipes': len(recipes)}
    
    def generate(self, ingredient, status, max_length=150):
        """Generate recipe suggestions"""
        
        if not self.is_trained and not self.load_model():
            raise Exception("Model not trained! Run train() first.")
        
        # Create prompt
        prompt = f"Ingredient: {ingredient} | Status: {status} | Recipe:"
        
        # Tokenize
        inputs = self.tokenizer(prompt, return_tensors='pt')
        
        # Generate
        with torch.no_grad():
            outputs = self.model.generate(
                inputs['input_ids'],
                max_length=max_length,
                num_return_sequences=1,
                temperature=0.8,
                top_p=0.9,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        # Decode
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract recipe part
        if "Recipe:" in generated_text:
            recipe = generated_text.split("Recipe:")[1].strip()
        else:
            recipe = generated_text
        
        return recipe
    
    def save_model(self):
        """Save trained model"""
        os.makedirs(self.model_path, exist_ok=True)
        self.model.save_pretrained(self.model_path)
        self.tokenizer.save_pretrained(self.model_path)
        print(f"💾 Recipe model saved to: {self.model_path}")
    
    def load_model(self):
        """Load trained model"""
        if os.path.exists(self.model_path):
            self.tokenizer = GPT2Tokenizer.from_pretrained(self.model_path)
            self.model = GPT2LMHeadModel.from_pretrained(self.model_path)
            self.is_trained = True
            print(f"✅ Recipe model loaded from: {self.model_path}")
            return True
        return False


# Singleton instance
_generator = None

def get_generator():
    """Get or create generator instance"""
    global _generator
    if _generator is None:
        _generator = RecipeGenerator()
        _generator.load_model()  # Try to load existing model
    return _generator
