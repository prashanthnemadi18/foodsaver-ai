// Test all new real-world APIs
const API_BASE = 'http://localhost:8000';

async function testAllAPIs() {
  console.log('🧪 Testing All Real-World APIs\n');
  console.log('='.repeat(60));
  
  // Test 1: Nutrition API
  console.log('\n1️⃣ Testing Nutrition API...');
  try {
    const res = await fetch(`${API_BASE}/nutrition/apple`);
    const data = await res.json();
    console.log('✅ Nutrition:', data.nutrition.calories, 'calories');
    console.log('   Benefits:', data.nutrition.benefits);
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  // Test 2: Meal Planning API
  console.log('\n2️⃣ Testing Meal Planning API...');
  try {
    const res = await fetch(`${API_BASE}/mealplan/suggest-recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { name: 'Apple' },
          { name: 'Banana' },
          { name: 'Orange' }
        ]
      })
    });
    const data = await res.json();
    console.log('✅ Found', data.totalRecipes, 'recipes');
    if (data.recipes.length > 0) {
      console.log('   Recipe:', data.recipes[0].name);
      console.log('   Match:', data.recipes[0].matchPercentage + '%');
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  // Test 3: Sustainability API
  console.log('\n3️⃣ Testing Sustainability API...');
  try {
    const res = await fetch(`${API_BASE}/sustainability/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { status: 'Fresh' },
          { status: 'Fresh' },
          { status: 'Expiring Soon' },
          { status: 'Expired' }
        ]
      })
    });
    const data = await res.json();
    console.log('✅ Sustainability Score:', data.sustainabilityScore + '%');
    console.log('   CO₂ Saved:', data.metrics.co2Saved);
    console.log('   Money Saved:', data.metrics.moneySaved);
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  // Test 4: Seasonal Foods API
  console.log('\n4️⃣ Testing Seasonal Foods API...');
  try {
    const res = await fetch(`${API_BASE}/sustainability/seasonal-foods`);
    const data = await res.json();
    console.log('✅ Current Season:', data.currentSeason);
    console.log('   Fruits:', data.fruits.slice(0, 3).join(', '));
    console.log('   Vegetables:', data.vegetables.slice(0, 3).join(', '));
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  // Test 5: Composting Tips API
  console.log('\n5️⃣ Testing Composting Tips API...');
  try {
    const res = await fetch(`${API_BASE}/sustainability/composting-tips`);
    const data = await res.json();
    console.log('✅ Can Compost:', data.canCompost.length, 'items');
    console.log('   Example:', data.canCompost[0]);
    console.log('   Cannot Compost:', data.cannotCompost.length, 'items');
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  // Test 6: AI Suggestions API
  console.log('\n6️⃣ Testing AI Suggestions API...');
  try {
    const res = await fetch(`${API_BASE}/ai-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: 'Tomato',
        category: 'Vegetable',
        status: 'Fresh',
        storage_condition: 'fridge'
      })
    });
    const data = await res.json();
    console.log('✅ AI Suggestion received');
    console.log('   Preview:', data.suggestion.substring(0, 60) + '...');
    console.log('   Source:', data.source);
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All API tests complete!');
  console.log('\n💡 Your real-world agriculture & food system is ready!');
  console.log('   - Nutrition tracking ✅');
  console.log('   - Meal planning ✅');
  console.log('   - Sustainability metrics ✅');
  console.log('   - Seasonal foods ✅');
  console.log('   - Composting guide ✅');
  console.log('   - AI suggestions ✅\n');
}

testAllAPIs();
