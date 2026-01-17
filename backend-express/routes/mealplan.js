import express from 'express';

const router = express.Router();

// Recipe database (simplified - in real app, this would be much larger)
const recipes = {
  // Fruit-based
  'fruit-salad': {
    name: 'Fresh Fruit Salad',
    ingredients: ['apple', 'banana', 'orange', 'strawberry'],
    prepTime: '10 min',
    difficulty: 'Easy',
    servings: 4,
    instructions: [
      'Wash and chop all fruits',
      'Mix in a large bowl',
      'Add honey or lemon juice if desired',
      'Serve chilled'
    ],
    nutrition: { calories: 150, protein: 2, carbs: 38, fat: 0.5 }
  },
  'apple-pie': {
    name: 'Classic Apple Pie',
    ingredients: ['apple', 'flour', 'butter', 'sugar'],
    prepTime: '60 min',
    difficulty: 'Medium',
    servings: 8,
    instructions: [
      'Peel and slice apples',
      'Make pie crust with flour and butter',
      'Fill with apple mixture',
      'Bake at 375°F for 45 minutes'
    ],
    nutrition: { calories: 320, protein: 3, carbs: 52, fat: 12 }
  },
  
  // Vegetable-based
  'vegetable-stir-fry': {
    name: 'Mixed Vegetable Stir-Fry',
    ingredients: ['carrot', 'broccoli', 'onion', 'garlic'],
    prepTime: '20 min',
    difficulty: 'Easy',
    servings: 4,
    instructions: [
      'Chop all vegetables',
      'Heat oil in wok or large pan',
      'Stir-fry vegetables for 5-7 minutes',
      'Add soy sauce and serve with rice'
    ],
    nutrition: { calories: 120, protein: 4, carbs: 18, fat: 4 }
  },
  'tomato-soup': {
    name: 'Creamy Tomato Soup',
    ingredients: ['tomato', 'onion', 'garlic', 'cream'],
    prepTime: '30 min',
    difficulty: 'Easy',
    servings: 4,
    instructions: [
      'Sauté onions and garlic',
      'Add chopped tomatoes and simmer',
      'Blend until smooth',
      'Add cream and season'
    ],
    nutrition: { calories: 180, protein: 3, carbs: 15, fat: 12 }
  },
  
  // Protein-based
  'grilled-chicken': {
    name: 'Herb Grilled Chicken',
    ingredients: ['chicken', 'herbs', 'lemon', 'olive oil'],
    prepTime: '30 min',
    difficulty: 'Medium',
    servings: 4,
    instructions: [
      'Marinate chicken with herbs and lemon',
      'Preheat grill to medium-high',
      'Grill chicken 6-8 minutes per side',
      'Let rest before serving'
    ],
    nutrition: { calories: 280, protein: 35, carbs: 2, fat: 14 }
  },
  'scrambled-eggs': {
    name: 'Fluffy Scrambled Eggs',
    ingredients: ['egg', 'milk', 'butter', 'salt'],
    prepTime: '10 min',
    difficulty: 'Easy',
    servings: 2,
    instructions: [
      'Beat eggs with milk',
      'Melt butter in pan',
      'Pour eggs and stir gently',
      'Cook until just set'
    ],
    nutrition: { calories: 220, protein: 16, carbs: 3, fat: 16 }
  },
  
  // Grain-based
  'fried-rice': {
    name: 'Vegetable Fried Rice',
    ingredients: ['rice', 'egg', 'carrot', 'peas', 'soy sauce'],
    prepTime: '25 min',
    difficulty: 'Easy',
    servings: 4,
    instructions: [
      'Cook rice and let cool',
      'Scramble eggs separately',
      'Stir-fry vegetables',
      'Add rice, eggs, and soy sauce'
    ],
    nutrition: { calories: 320, protein: 10, carbs: 52, fat: 8 }
  },
  'pasta-primavera': {
    name: 'Pasta Primavera',
    ingredients: ['pasta', 'tomato', 'broccoli', 'garlic', 'olive oil'],
    prepTime: '25 min',
    difficulty: 'Easy',
    servings: 4,
    instructions: [
      'Cook pasta according to package',
      'Sauté vegetables in olive oil',
      'Toss pasta with vegetables',
      'Add parmesan and serve'
    ],
    nutrition: { calories: 380, protein: 14, carbs: 68, fat: 8 }
  }
};

// Get recipe suggestions based on available items
router.post('/suggest-recipes', (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array required' });
    }
    
    const availableItems = items.map(item => item.name.toLowerCase());
    const suggestions = [];
    
    // Find recipes that can be made with available items
    for (const [recipeId, recipe] of Object.entries(recipes)) {
      const matchedIngredients = recipe.ingredients.filter(ing => 
        availableItems.some(item => item.includes(ing) || ing.includes(item))
      );
      
      const matchPercentage = (matchedIngredients.length / recipe.ingredients.length) * 100;
      
      if (matchPercentage >= 50) { // At least 50% ingredients available
        suggestions.push({
          id: recipeId,
          ...recipe,
          matchPercentage: Math.round(matchPercentage),
          matchedIngredients,
          missingIngredients: recipe.ingredients.filter(ing => !matchedIngredients.includes(ing)),
          canMake: matchPercentage === 100
        });
      }
    }
    
    // Sort by match percentage
    suggestions.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    res.json({
      totalRecipes: suggestions.length,
      recipes: suggestions,
      tip: suggestions.length === 0 
        ? 'Add more items to get recipe suggestions!' 
        : `You can make ${suggestions.filter(r => r.canMake).length} recipes with your current items!`
    });
    
  } catch (error) {
    console.error('[MealPlan] Error:', error);
    res.status(500).json({ error: 'Failed to suggest recipes' });
  }
});

// Get weekly meal plan
router.post('/weekly-plan', (req, res) => {
  try {
    const { items, preferences } = req.body;
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealPlan = {};
    
    // Simple meal planning logic
    const availableRecipes = Object.entries(recipes);
    
    daysOfWeek.forEach((day, index) => {
      const recipe = availableRecipes[index % availableRecipes.length];
      mealPlan[day] = {
        breakfast: { name: 'Scrambled Eggs', prepTime: '10 min' },
        lunch: { name: recipe[1].name, prepTime: recipe[1].prepTime },
        dinner: { name: availableRecipes[(index + 1) % availableRecipes.length][1].name, prepTime: availableRecipes[(index + 1) % availableRecipes.length][1].prepTime }
      };
    });
    
    res.json({
      weekOf: new Date().toISOString().split('T')[0],
      mealPlan,
      shoppingList: generateShoppingList(mealPlan),
      totalCalories: 6000, // Estimated
      tip: 'Prep ingredients on Sunday for easier weekday cooking!'
    });
    
  } catch (error) {
    console.error('[MealPlan] Error:', error);
    res.status(500).json({ error: 'Failed to create meal plan' });
  }
});

// Generate shopping list
function generateShoppingList(mealPlan) {
  const items = new Set();
  
  // Add common ingredients
  ['eggs', 'milk', 'bread', 'rice', 'pasta', 'chicken', 'vegetables', 'fruits'].forEach(item => {
    items.add(item);
  });
  
  return Array.from(items);
}

// Get recipe by ID
router.get('/recipe/:id', (req, res) => {
  const recipe = recipes[req.params.id];
  
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  res.json(recipe);
});

export default router;
