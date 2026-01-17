// Test AI Suggestions Endpoint
// Run with: node test-ai-suggestions.js

const API_BASE = 'http://127.0.0.1:8000';

async function testAISuggestion(itemName, category, status) {
  console.log(`\n🧪 Testing AI suggestion for: ${itemName} (${status})`);
  console.log('─'.repeat(60));
  
  try {
    const response = await fetch(`${API_BASE}/ai-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: itemName,
        category: category,
        status: status,
        storage_condition: 'fridge'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Success!');
    console.log(`📝 Source: ${data.source || 'unknown'}`);
    console.log(`💡 Suggestion:\n${data.suggestion}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting AI Suggestions Tests...\n');
  
  // Test 1: Fresh Apple
  await testAISuggestion('Apple', 'Fruit', 'Fresh');
  
  // Test 2: Expiring Banana
  await testAISuggestion('Banana', 'Fruit', 'Expiring Soon');
  
  // Test 3: Expired Milk
  await testAISuggestion('Milk', 'Dairy', 'Expired');
  
  // Test 4: Fresh Carrot
  await testAISuggestion('Carrot', 'Vegetable', 'Fresh');
  
  // Test 5: Unknown item
  await testAISuggestion('Dragon Fruit', 'Fruit', 'Fresh');
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ All tests completed!');
  console.log('='.repeat(60));
}

// Run the tests
runTests().catch(console.error);
