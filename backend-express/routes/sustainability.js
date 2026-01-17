import express from 'express';

const router = express.Router();

// Calculate sustainability metrics
router.post('/metrics', (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array required' });
    }
    
    // Calculate metrics
    const totalItems = items.length;
    const freshItems = items.filter(i => i.status?.toLowerCase() === 'fresh').length;
    const expiringItems = items.filter(i => i.status?.toLowerCase() === 'expiring soon').length;
    const expiredItems = items.filter(i => i.status?.toLowerCase() === 'expired').length;
    
    // Sustainability score (0-100)
    const wastePreventionRate = totalItems > 0 ? ((freshItems + expiringItems) / totalItems) * 100 : 100;
    const sustainabilityScore = Math.round(wastePreventionRate);
    
    // Estimated CO2 saved (kg) - average 2.5kg CO2 per kg of food waste prevented
    const itemsSaved = freshItems + expiringItems;
    const avgWeightPerItem = 0.3; // kg
    const co2PerKg = 2.5;
    const co2Saved = Math.round(itemsSaved * avgWeightPerItem * co2PerKg * 10) / 10;
    
    // Money saved (estimated $3 per item)
    const moneySaved = itemsSaved * 3;
    
    // Waste prevented (kg)
    const wastePrevented = Math.round(itemsSaved * avgWeightPerItem * 10) / 10;
    
    res.json({
      sustainabilityScore,
      metrics: {
        totalItems,
        freshItems,
        expiringItems,
        expiredItems,
        itemsSaved,
        wastePrevented: `${wastePrevented} kg`,
        co2Saved: `${co2Saved} kg CO₂`,
        moneySaved: `$${moneySaved}`,
      },
      tips: getSustainabilityTips(sustainabilityScore, expiredItems)
    });
    
  } catch (error) {
    console.error('[Sustainability] Error:', error);
    res.status(500).json({ error: 'Failed to calculate metrics' });
  }
});

// Get composting tips
router.get('/composting-tips', (req, res) => {
  const tips = {
    canCompost: [
      '🥬 Vegetable scraps and peels',
      '🍎 Fruit scraps and cores',
      '🍞 Bread and grains (small amounts)',
      '☕ Coffee grounds and tea bags',
      '🥚 Eggshells (crushed)',
      '🌾 Rice and pasta (cooked)',
      '🥜 Nut shells',
    ],
    cannotCompost: [
      '🥩 Meat and fish',
      '🧀 Dairy products',
      '🍕 Oily or greasy foods',
      '🦴 Bones',
      '🥛 Milk and cheese',
    ],
    tips: [
      'Balance "green" (nitrogen) and "brown" (carbon) materials',
      'Keep compost moist but not soggy',
      'Turn compost regularly for faster decomposition',
      'Chop large pieces for faster breakdown',
      'Avoid adding diseased plants',
    ]
  };
  
  res.json(tips);
});

// Get donation centers (mock data - can be replaced with real API)
router.get('/donation-centers', (req, res) => {
  const centers = [
    {
      name: 'Local Food Bank',
      type: 'Food Bank',
      accepts: 'Non-perishable items, fresh produce',
      contact: 'Call to arrange pickup',
      tip: 'Donate before expiry date'
    },
    {
      name: 'Community Fridge',
      type: 'Community Sharing',
      accepts: 'Fresh food, packaged items',
      contact: 'Drop off anytime',
      tip: 'Label items with date'
    },
    {
      name: 'Homeless Shelter',
      type: 'Shelter',
      accepts: 'Canned goods, fresh meals',
      contact: 'Call ahead',
      tip: 'Prepare meal portions'
    },
    {
      name: 'Animal Shelter',
      type: 'Animal Care',
      accepts: 'Fruits, vegetables (safe for animals)',
      contact: 'Check accepted items',
      tip: 'No onions, garlic, or grapes'
    }
  ];
  
  res.json(centers);
});

// Get seasonal food recommendations
router.get('/seasonal-foods', (req, res) => {
  const month = new Date().getMonth(); // 0-11
  
  const seasonalFoods = {
    winter: { // Dec, Jan, Feb (11, 0, 1)
      fruits: ['🍊 Oranges', '🍋 Lemons', '🍐 Pears', '🍎 Apples', '🥝 Kiwi'],
      vegetables: ['🥬 Kale', '🥕 Carrots', '🧅 Onions', '🥔 Potatoes', '🌰 Squash'],
      benefits: 'Winter produce is rich in vitamin C and stores well'
    },
    spring: { // Mar, Apr, May (2, 3, 4)
      fruits: ['🍓 Strawberries', '🍒 Cherries', '🥭 Mangoes'],
      vegetables: ['🥬 Spinach', '🥒 Asparagus', '🥬 Lettuce', '🥕 Radishes', '🧄 Garlic'],
      benefits: 'Spring greens are fresh and nutrient-dense'
    },
    summer: { // Jun, Jul, Aug (5, 6, 7)
      fruits: ['🍉 Watermelon', '🍑 Peaches', '🫐 Blueberries', '🍇 Grapes', '🍅 Tomatoes'],
      vegetables: ['🥒 Cucumbers', '🌽 Corn', '🫑 Peppers', '🥦 Zucchini', '🍆 Eggplant'],
      benefits: 'Summer produce is hydrating and perfect for fresh eating'
    },
    fall: { // Sep, Oct, Nov (8, 9, 10)
      fruits: ['🍎 Apples', '🍐 Pears', '🍇 Grapes', '🍊 Pomegranates'],
      vegetables: ['🎃 Pumpkin', '🥕 Carrots', '🥔 Sweet Potatoes', '🥦 Broccoli', '🧅 Onions'],
      benefits: 'Fall harvest is perfect for roasting and preserving'
    }
  };
  
  let season;
  if (month === 11 || month <= 1) season = 'winter';
  else if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else season = 'fall';
  
  res.json({
    currentSeason: season,
    ...seasonalFoods[season],
    tip: 'Buying seasonal food supports local farmers and reduces carbon footprint!'
  });
});

function getSustainabilityTips(score, expiredItems) {
  const tips = [];
  
  if (score >= 80) {
    tips.push('🌟 Excellent! You\'re doing great at preventing food waste!');
    tips.push('💚 Keep tracking your items regularly');
  } else if (score >= 60) {
    tips.push('👍 Good job! A few improvements can make a big difference');
    tips.push('📅 Check expiry dates more frequently');
  } else {
    tips.push('⚠️ You can do better! Focus on using items before they expire');
    tips.push('🔔 Set reminders for expiring items');
  }
  
  if (expiredItems > 0) {
    tips.push(`♻️ You have ${expiredItems} expired item(s) - consider composting organic waste`);
    tips.push('🎁 Donate excess food before it expires');
  }
  
  tips.push('🌱 Plan meals around items that expire soon');
  tips.push('❄️ Freeze items you won\'t use immediately');
  
  return tips;
}

export default router;
