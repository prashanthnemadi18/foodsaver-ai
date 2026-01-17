import express from 'express';

const router = express.Router();

// In-memory storage for analytics (in real app, use database)
const userAnalytics = new Map();

// Track item usage
router.post('/track', (req, res) => {
  try {
    const { userId, action, item } = req.body;
    
    if (!userId || !action || !item) {
      return res.status(400).json({ error: 'userId, action, and item required' });
    }
    
    if (!userAnalytics.has(userId)) {
      userAnalytics.set(userId, {
        itemsAdded: [],
        itemsUsed: [],
        itemsExpired: [],
        totalSavings: 0,
        wasteReduced: 0
      });
    }
    
    const analytics = userAnalytics.get(userId);
    
    switch (action) {
      case 'added':
        analytics.itemsAdded.push({ ...item, timestamp: new Date() });
        break;
      case 'used':
        analytics.itemsUsed.push({ ...item, timestamp: new Date() });
        analytics.totalSavings += 3; // Estimated $3 per item
        analytics.wasteReduced += 0.3; // Estimated 0.3kg per item
        break;
      case 'expired':
        analytics.itemsExpired.push({ ...item, timestamp: new Date() });
        break;
    }
    
    userAnalytics.set(userId, analytics);
    
    res.json({ success: true, analytics: getAnalyticsSummary(analytics) });
    
  } catch (error) {
    console.error('[Analytics] Error:', error);
    res.status(500).json({ error: 'Failed to track analytics' });
  }
});

// Get user analytics
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { period } = req.query; // 'week', 'month', 'year'
    
    const analytics = userAnalytics.get(userId) || {
      itemsAdded: [],
      itemsUsed: [],
      itemsExpired: [],
      totalSavings: 0,
      wasteReduced: 0
    };
    
    const summary = getAnalyticsSummary(analytics);
    const trends = calculateTrends(analytics, period);
    const insights = generateInsights(analytics);
    
    res.json({
      summary,
      trends,
      insights,
      period: period || 'all-time'
    });
    
  } catch (error) {
    console.error('[Analytics] Error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get waste report
router.get('/:userId/waste-report', (req, res) => {
  try {
    const { userId } = req.params;
    
    const analytics = userAnalytics.get(userId) || {
      itemsAdded: [],
      itemsUsed: [],
      itemsExpired: [],
      totalSavings: 0,
      wasteReduced: 0
    };
    
    const totalItems = analytics.itemsAdded.length;
    const usedItems = analytics.itemsUsed.length;
    const expiredItems = analytics.itemsExpired.length;
    
    const wasteRate = totalItems > 0 ? (expiredItems / totalItems) * 100 : 0;
    const successRate = totalItems > 0 ? (usedItems / totalItems) * 100 : 0;
    
    // Most wasted categories
    const categoryWaste = {};
    analytics.itemsExpired.forEach(item => {
      const category = item.category || 'Unknown';
      categoryWaste[category] = (categoryWaste[category] || 0) + 1;
    });
    
    const mostWasted = Object.entries(categoryWaste)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
    
    res.json({
      wasteRate: Math.round(wasteRate),
      successRate: Math.round(successRate),
      totalItems,
      usedItems,
      expiredItems,
      mostWasted,
      recommendations: getWasteRecommendations(wasteRate, mostWasted),
      environmentalImpact: {
        co2Saved: `${Math.round(analytics.wasteReduced * 2.5)} kg CO₂`,
        waterSaved: `${Math.round(analytics.wasteReduced * 1000)} liters`,
        landSaved: `${Math.round(analytics.wasteReduced * 0.5)} m²`
      }
    });
    
  } catch (error) {
    console.error('[Analytics] Error:', error);
    res.status(500).json({ error: 'Failed to generate waste report' });
  }
});

// Helper functions
function getAnalyticsSummary(analytics) {
  return {
    totalItemsAdded: analytics.itemsAdded.length,
    totalItemsUsed: analytics.itemsUsed.length,
    totalItemsExpired: analytics.itemsExpired.length,
    totalSavings: `$${analytics.totalSavings}`,
    wasteReduced: `${analytics.wasteReduced.toFixed(1)} kg`,
    successRate: analytics.itemsAdded.length > 0 
      ? `${Math.round((analytics.itemsUsed.length / analytics.itemsAdded.length) * 100)}%`
      : '0%'
  };
}

function calculateTrends(analytics, period) {
  // Simplified trend calculation
  const now = new Date();
  const periodMs = {
    'week': 7 * 24 * 60 * 60 * 1000,
    'month': 30 * 24 * 60 * 60 * 1000,
    'year': 365 * 24 * 60 * 60 * 1000
  };
  
  const cutoff = period && periodMs[period] 
    ? new Date(now - periodMs[period])
    : new Date(0);
  
  const recentAdded = analytics.itemsAdded.filter(i => new Date(i.timestamp) > cutoff).length;
  const recentUsed = analytics.itemsUsed.filter(i => new Date(i.timestamp) > cutoff).length;
  const recentExpired = analytics.itemsExpired.filter(i => new Date(i.timestamp) > cutoff).length;
  
  return {
    itemsAdded: recentAdded,
    itemsUsed: recentUsed,
    itemsExpired: recentExpired,
    trend: recentUsed > recentExpired ? 'improving' : 'needs attention'
  };
}

function generateInsights(analytics) {
  const insights = [];
  
  const wasteRate = analytics.itemsAdded.length > 0 
    ? (analytics.itemsExpired.length / analytics.itemsAdded.length) * 100 
    : 0;
  
  if (wasteRate < 10) {
    insights.push('🌟 Excellent! You\'re wasting less than 10% of your food!');
  } else if (wasteRate < 25) {
    insights.push('👍 Good job! You\'re doing better than average.');
  } else {
    insights.push('⚠️ You can improve! Try using items before they expire.');
  }
  
  if (analytics.totalSavings > 50) {
    insights.push(`💰 You've saved $${analytics.totalSavings} by reducing waste!`);
  }
  
  if (analytics.wasteReduced > 5) {
    insights.push(`🌍 You've prevented ${analytics.wasteReduced.toFixed(1)}kg of food waste!`);
  }
  
  return insights;
}

function getWasteRecommendations(wasteRate, mostWasted) {
  const recommendations = [];
  
  if (wasteRate > 25) {
    recommendations.push('Set reminders to check expiring items daily');
    recommendations.push('Plan meals around items that expire soon');
    recommendations.push('Freeze items you won\'t use immediately');
  }
  
  if (mostWasted.length > 0) {
    recommendations.push(`Focus on using ${mostWasted[0].category} items - they expire most often`);
  }
  
  recommendations.push('Use the AI suggestions feature for creative recipes');
  recommendations.push('Share excess food with neighbors or donate');
  
  return recommendations;
}

export default router;
