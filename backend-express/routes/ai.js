import express from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

const router = express.Router();

// Python ML Service URL
const PYTHON_ML_SERVICE = process.env.PYTHON_ML_SERVICE || 'http://localhost:8001';

// ============================================
// ENHANCED AI SUGGESTION SYSTEM
// Multiple AI providers with smart fallback
// ============================================

// Enhanced fallback suggestions database
const FALLBACK_SUGGESTIONS = {
  // Fruits
  apple: {
    fresh: "🍎 Fresh Apple Ideas:\n• Slice with peanut butter for protein boost\n• Add to morning oatmeal with cinnamon\n• Make Waldorf salad with walnuts\n• Bake healthy apple muffins\n• Enjoy as crunchy snack",
    expiring: "🍎 Quick Apple Recipes:\n• Fresh apple juice or cider\n• Classic apple pie or crisp\n• Homemade applesauce (freeze it!)\n• Add to smoothies for sweetness\n• Roast with pork tenderloin",
    expired: "🍎 Soft Apple Uses:\n• Applesauce or apple butter\n• Apple pie filling (freeze)\n• Ferment into apple cider vinegar\n• Dehydrate into apple chips\n• Compost for rich soil"
  },
  banana: {
    fresh: "🍌 Fresh Banana Ideas:\n• Breakfast cereal topping\n• Protein shake ingredient\n• Toast with honey spread\n• Portable healthy snack\n• Slice into yogurt parfait",
    expiring: "🍌 Ripe Banana Recipes:\n• Freeze for future smoothies\n• Banana bread or muffins\n• Pancake batter mix-in\n• Blend into nice cream\n• Make banana pancakes",
    expired: "🍌 Overripe Banana Magic:\n• Moist banana bread\n• Banana ice cream (frozen)\n• Natural face mask\n• Smoothie sweetener\n• Fluffy banana pancakes"
  },
  // Add more items...
};

// ============================================
// AI PROVIDER FUNCTIONS
// ============================================

/**
 * Try Python ML Service (HuggingFace, spaCy, PyTorch, Scikit-learn)
 */
async function tryPythonML(itemName, category, status, storage) {
  try {
    console.log('[AI] Trying Python ML Service (Transformers + spaCy)...');
    
    const response = await fetch(`${PYTHON_ML_SERVICE}/ai-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: itemName,
        category: category || 'Food',
        status: status || 'Fresh',
        storage_condition: storage || 'fridge'
      }),
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Python ML Service returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.suggestion) {
      console.log('[AI] ✅ Python ML Service success!');
      return { 
        suggestion: data.suggestion, 
        source: data.source || 'python_ml',
        provider: data.provider || 'Python ML Service (Transformers + spaCy)'
      };
    }
    
    return null;
  } catch (error) {
    console.error('[AI] Python ML Service error:', error.message);
    return null;
  }
}

/**
 * Try Google Gemini AI (FREE, FAST)
 */
async function tryGemini(prompt) {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  // Validate API key
  if (!geminiKey || geminiKey.length < 20 || geminiKey.includes('your-') || geminiKey.includes('placeholder')) {
    console.log('[AI] Gemini: API key not configured or invalid');
    return null;
  }

  try {
    console.log('[AI] Trying Google Gemini...');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text && text.length > 20) {
      console.log('[AI] ✅ Gemini success!');
      return { suggestion: text, source: 'gemini', provider: 'Google Gemini AI' };
    }
    
    console.log('[AI] Gemini returned empty response');
    return null;
  } catch (error) {
    console.error('[AI] Gemini error:', error.message);
    return null;
  }
}

/**
 * Try OpenAI GPT (PAID, HIGH QUALITY)
 */
async function tryOpenAI(prompt) {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  // Validate API key
  if (!openaiKey || openaiKey.length < 20 || openaiKey.includes('your-') || openaiKey.includes('placeholder')) {
    console.log('[AI] OpenAI: API key not configured or invalid');
    return null;
  }

  try {
    console.log('[AI] Trying OpenAI GPT...');
    const openai = new OpenAI({ apiKey: openaiKey });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and affordable
      messages: [
        { 
          role: "system", 
          content: "You are an expert food management assistant specializing in reducing food waste. Provide creative, practical suggestions with emojis." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const text = completion?.choices?.[0]?.message?.content?.trim();
    
    if (text && text.length > 20) {
      console.log('[AI] ✅ OpenAI success!');
      return { suggestion: text, source: 'openai', provider: 'OpenAI GPT-4' };
    }
    
    console.log('[AI] OpenAI returned empty response');
    return null;
  } catch (error) {
    console.error('[AI] OpenAI error:', error.message);
    return null;
  }
}

/**
 * Smart local fallback suggestions
 */
function getSmartFallback(itemName, category, status, storage) {
  console.log('[AI] Using smart fallback suggestions...');
  
  const item = itemName.toLowerCase();
  const statusLower = status?.toLowerCase() || 'fresh';
  const categoryLower = category?.toLowerCase() || '';
  
  // Try exact match first
  for (const [key, suggestions] of Object.entries(FALLBACK_SUGGESTIONS)) {
    if (item.includes(key)) {
      if (statusLower.includes('expired')) {
        return { suggestion: suggestions.expired, source: 'fallback', provider: 'Smart Suggestions' };
      } else if (statusLower.includes('expiring')) {
        return { suggestion: suggestions.expiring, source: 'fallback', provider: 'Smart Suggestions' };
      } else {
        return { suggestion: suggestions.fresh, source: 'fallback', provider: 'Smart Suggestions' };
      }
    }
  }
  
  // Category-based suggestions
  let suggestion = '';
  
  if (categoryLower.includes('fruit')) {
    if (statusLower.includes('expired')) {
      suggestion = `🍎 Creative Uses for Expired ${itemName}:\n• Make fruit jam or preserves\n• Blend into smoothies\n• Bake into desserts (pie, crisp, muffins)\n• Dehydrate into fruit leather\n• Compost for garden nutrients`;
    } else if (statusLower.includes('expiring')) {
      suggestion = `🍎 Quick Ideas for Expiring ${itemName}:\n• Make fresh fruit juice\n• Add to smoothies or yogurt\n• Bake into desserts\n• Freeze for later use\n• Make fruit salad`;
    } else {
      suggestion = `🍎 Fresh ${itemName} Ideas:\n• Enjoy as healthy snack\n• Add to breakfast bowls\n• Make fresh juice\n• Use in salads\n• Pack for lunch`;
    }
  } else if (categoryLower.includes('vegetable') || categoryLower.includes('veggie')) {
    if (statusLower.includes('expired')) {
      suggestion = `🥕 Creative Uses for Expired ${itemName}:\n• Make vegetable soup or stew\n• Roast for concentrated flavor\n• Make vegetable stock\n• Add to compost\n• Use in long-cooked dishes`;
    } else if (statusLower.includes('expiring')) {
      suggestion = `🥕 Quick Ideas for Expiring ${itemName}:\n• Make stir-fry or curry\n• Roast with olive oil\n• Add to soups or stews\n• Make vegetable juice\n• Freeze for later`;
    } else {
      suggestion = `🥕 Fresh ${itemName} Ideas:\n• Eat raw with dip\n• Add to fresh salads\n• Use in cooking\n• Make fresh juice\n• Store properly`;
    }
  } else if (categoryLower.includes('dairy')) {
    if (statusLower.includes('expired')) {
      suggestion = `🥛 Creative Uses for Expired ${itemName}:\n• Use in baking recipes\n• Make cheese or yogurt\n• Use as plant fertilizer (diluted)\n• Create face masks\n• Add to compost`;
    } else if (statusLower.includes('expiring')) {
      suggestion = `🥛 Quick Ideas for Expiring ${itemName}:\n• Use in smoothies\n• Bake cakes or muffins\n• Make creamy sauces\n• Freeze for later\n• Use in cooking`;
    } else {
      suggestion = `🥛 Fresh ${itemName} Ideas:\n• Enjoy with meals\n• Use in coffee or tea\n• Make smoothies\n• Use in cereal\n• Store properly`;
    }
  } else {
    // Generic suggestions
    if (statusLower.includes('expired')) {
      suggestion = `♻️ Creative Uses for Expired ${itemName}:\n• Check if it can be composted\n• Use for non-food purposes\n• Make stock or broth\n• Use as plant fertilizer\n• Repurpose for DIY projects`;
    } else if (statusLower.includes('expiring')) {
      suggestion = `⚡ Quick Ideas for Expiring ${itemName}:\n• Use it in your next meal\n• Freeze for later use\n• Share with neighbors or friends\n• Make a quick recipe\n• Preserve it (pickle, can, or dry)`;
    } else {
      suggestion = `✨ Fresh ${itemName} Ideas:\n• Enjoy it fresh and raw\n• Use in your favorite recipes\n• Store properly to extend freshness\n• Share with family and friends\n• Plan meals around it`;
    }
  }
  
  return { suggestion, source: 'fallback', provider: 'Smart Suggestions' };
}

// ============================================
// MAIN AI SUGGESTION ENDPOINT
// ============================================

router.post('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { item_name, category, status, storage_condition } = req.body;
    
    console.log('\n[AI] ═══════════════════════════════════════');
    console.log('[AI] New suggestion request:');
    console.log('[AI] Item:', item_name);
    console.log('[AI] Category:', category);
    console.log('[AI] Status:', status);
    console.log('[AI] Storage:', storage_condition);
    console.log('[AI] ═══════════════════════════════════════');

    // Validation
    if (!item_name || item_name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Item name is required',
        success: false 
      });
    }

    // Determine status text
    const statusText = status?.toLowerCase().includes('expired') ? 'expired' : 
                      status?.toLowerCase().includes('expiring') ? 'expiring soon' : 'fresh';
    
    // Create optimized prompt
    const prompt = `As a food waste reduction expert, provide 5 creative and practical suggestions for using ${statusText} ${item_name} (${category || 'food item'}).

Include:
- Quick recipe ideas
- Storage tips
- Alternative uses
- Preservation methods

Format as bullet points with emojis. Be concise, helpful, and focus on reducing food waste.`;

    // Try AI providers in order of preference
    let result = null;
    
    // 1. Try Python ML Service (HuggingFace Transformers + spaCy + PyTorch)
    result = await tryPythonML(item_name, category, status, storage_condition);
    if (result) {
      const duration = Date.now() - startTime;
      console.log(`[AI] ✅ Success with ${result.provider} (${duration}ms)`);
      return res.json({ ...result, duration, success: true });
    }
    
    // 2. Try Gemini (FREE, FAST)
    result = await tryGemini(prompt);
    if (result) {
      const duration = Date.now() - startTime;
      console.log(`[AI] ✅ Success with ${result.provider} (${duration}ms)`);
      return res.json({ ...result, duration, success: true });
    }
    
    // 3. Try OpenAI (PAID, HIGH QUALITY)
    result = await tryOpenAI(prompt);
    if (result) {
      const duration = Date.now() - startTime;
      console.log(`[AI] ✅ Success with ${result.provider} (${duration}ms)`);
      return res.json({ ...result, duration, success: true });
    }
    
    // 4. Use smart fallback
    result = getSmartFallback(item_name, category, status, storage_condition);
    const duration = Date.now() - startTime;
    console.log(`[AI] ✅ Success with ${result.provider} (${duration}ms)`);
    return res.json({ ...result, duration, success: true });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[AI] ❌ Fatal error:', error);
    
    // Emergency fallback
    const emergencyResult = getSmartFallback(
      req.body.item_name || 'food item',
      req.body.category,
      req.body.status,
      req.body.storage_condition
    );
    
    return res.json({
      ...emergencyResult,
      duration,
      success: true,
      note: 'Using emergency fallback due to error'
    });
  }
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

router.get('/health', async (req, res) => {
  // Check Python ML Service
  let pythonMLStatus = false;
  try {
    const response = await fetch(`${PYTHON_ML_SERVICE}/health`, { timeout: 3000 });
    pythonMLStatus = response.ok;
  } catch (e) {
    pythonMLStatus = false;
  }
  
  const geminiConfigured = process.env.GEMINI_API_KEY && 
                          process.env.GEMINI_API_KEY.length > 20 &&
                          !process.env.GEMINI_API_KEY.includes('your-');
  
  const openaiConfigured = process.env.OPENAI_API_KEY && 
                          process.env.OPENAI_API_KEY.length > 20 &&
                          !process.env.OPENAI_API_KEY.includes('your-');
  
  res.json({
    status: 'healthy',
    providers: {
      python_ml: {
        configured: pythonMLStatus,
        priority: 1,
        cost: 'FREE',
        models: 'HuggingFace Transformers, spaCy, PyTorch, Scikit-learn',
        url: PYTHON_ML_SERVICE
      },
      gemini: {
        configured: geminiConfigured,
        priority: 2,
        cost: 'FREE'
      },
      openai: {
        configured: openaiConfigured,
        priority: 3,
        cost: 'PAID'
      },
      fallback: {
        configured: true,
        priority: 4,
        cost: 'FREE'
      }
    },
    recommendation: pythonMLStatus ? 
      'Using Python ML Service (Transformers + spaCy - BEST)' : 
      geminiConfigured ? 
      'Using Google Gemini' : 
      openaiConfigured ?
      'Using OpenAI GPT' :
      'Using smart fallback suggestions'
  });
});

export default router;
