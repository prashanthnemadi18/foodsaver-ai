import express from 'express';

const router = express.Router();

// Nutrition database (in real app, this would be from a database or API)
const nutritionData = {
  // Fruits
  apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, vitaminC: 14, benefits: 'Rich in antioxidants, supports heart health' },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, potassium: 422, benefits: 'High in potassium, boosts energy' },
  orange: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, vitaminC: 70, benefits: 'Immune system support, high vitamin C' },
  mango: { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, vitaminA: 25, benefits: 'Rich in vitamins A and C, aids digestion' },
  strawberry: { calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, vitaminC: 89, benefits: 'Antioxidant-rich, heart healthy' },
  
  // Vegetables
  tomato: { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, vitaminC: 21, benefits: 'Rich in lycopene, supports heart health' },
  carrot: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, vitaminA: 334, benefits: 'Excellent for eye health, high in beta-carotene' },
  spinach: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, iron: 2.7, benefits: 'High in iron, supports bone health' },
  broccoli: { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 2.4, vitaminC: 135, benefits: 'Cancer-fighting properties, vitamin K rich' },
  potato: { calories: 163, protein: 4.3, carbs: 37, fat: 0.2, fiber: 2.5, potassium: 926, benefits: 'Good source of potassium and vitamin B6' },
  
  // Dairy
  milk: { calories: 149, protein: 7.7, carbs: 12, fat: 8, calcium: 276, benefits: 'Builds strong bones, high in calcium' },
  cheese: { calories: 402, protein: 25, carbs: 1.3, fat: 33, calcium: 721, benefits: 'High in protein and calcium' },
  yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, calcium: 110, probiotics: 'yes', benefits: 'Gut health, probiotic-rich' },
  
  // Protein
  chicken: { calories: 239, protein: 27, carbs: 0, fat: 14, iron: 1, benefits: 'Lean protein, muscle building' },
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11, vitaminD: 41, benefits: 'Complete protein, brain health' },
  fish: { calories: 206, protein: 22, carbs: 0, fat: 12, omega3: 'high', benefits: 'Heart healthy, rich in omega-3' },
  
  // Grains
  rice: { calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, benefits: 'Energy source, gluten-free' },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, benefits: 'Energy source, B vitamins' },
  pasta: { calories: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3.2, benefits: 'Sustained energy, versatile' },
};

// Get nutrition info for an item
router.get('/:itemName', (req, res) => {
  try {
    const itemName = req.params.itemName.toLowerCase();
    
    // Try exact match
    let nutrition = nutritionData[itemName];
    
    // Try partial match
    if (!nutrition) {
      const matchedKey = Object.keys(nutritionData).find(key => 
        itemName.includes(key) || key.includes(itemName)
      );
      if (matchedKey) {
        nutrition = nutritionData[matchedKey];
      }
    }
    
    if (!nutrition) {
      return res.json({
        itemName: req.params.itemName,
        message: 'Nutrition data not available',
        generic: {
          calories: 'Varies',
          protein: 'Varies',
          carbs: 'Varies',
          fat: 'Varies',
          tip: 'Check product label for accurate nutrition information'
        }
      });
    }
    
    res.json({
      itemName: req.params.itemName,
      nutrition,
      servingSize: '100g',
      dailyValues: calculateDailyValues(nutrition)
    });
    
  } catch (error) {
    console.error('[Nutrition] Error:', error);
    res.status(500).json({ error: 'Failed to get nutrition info' });
  }
});

// Get allergen information
router.get('/:itemName/allergens', (req, res) => {
  const itemName = req.params.itemName.toLowerCase();
  
  const allergens = {
    milk: ['dairy', 'lactose'],
    cheese: ['dairy', 'lactose'],
    yogurt: ['dairy', 'lactose'],
    egg: ['eggs'],
    fish: ['fish'],
    bread: ['gluten', 'wheat'],
    pasta: ['gluten', 'wheat'],
    // Add more as needed
  };
  
  const itemAllergens = allergens[itemName] || [];
  
  res.json({
    itemName: req.params.itemName,
    allergens: itemAllergens,
    safe: itemAllergens.length === 0,
    warning: itemAllergens.length > 0 ? `Contains: ${itemAllergens.join(', ')}` : 'No common allergens detected'
  });
});

// Calculate daily values (based on 2000 calorie diet)
function calculateDailyValues(nutrition) {
  return {
    calories: nutrition.calories ? `${Math.round((nutrition.calories / 2000) * 100)}%` : 'N/A',
    protein: nutrition.protein ? `${Math.round((nutrition.protein / 50) * 100)}%` : 'N/A',
    carbs: nutrition.carbs ? `${Math.round((nutrition.carbs / 300) * 100)}%` : 'N/A',
    fat: nutrition.fat ? `${Math.round((nutrition.fat / 78) * 100)}%` : 'N/A',
    fiber: nutrition.fiber ? `${Math.round((nutrition.fiber / 28) * 100)}%` : 'N/A',
  };
}

export default router;
