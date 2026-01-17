import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = express.Router();

// In-memory items storage (replace with database in production)
const items = new Map();

// Helper function to predict expiry
function predictExpiry(item) {
  const expiryDays = {
    'fridge': { 'dairy': 7, 'vegetable': 5, 'fruit': 5, 'meat': 3, 'default': 5 },
    'freezer': { 'default': 90 },
    'pantry': { 'default': 30 }
  };

  const storage = item.storage_condition || 'fridge';
  const category = item.category?.toLowerCase() || 'default';
  const days = expiryDays[storage]?.[category] || expiryDays[storage]?.['default'] || 5;

  const purchaseDate = item.purchase_date ? new Date(item.purchase_date) : new Date();
  const expiryDate = new Date(purchaseDate);
  expiryDate.setDate(expiryDate.getDate() + days);

  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  let status = 'fresh';
  if (daysUntilExpiry < 0) {
    status = 'expired';
  } else if (daysUntilExpiry <= 3) {
    status = 'expiring soon';
  }

  return {
    predicted_expiry: expiryDate.toISOString().split('T')[0],
    status,
    daysUntilExpiry
  };
}

// Get all items for a user
router.get('/:userId/items', (req, res) => {
  try {
    const { userId } = req.params;
    const userItems = Array.from(items.values()).filter(item => item.userId === userId);
    res.json(userItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
});

// Create item
router.post('/:userId/items', (req, res) => {
  try {
    const { userId } = req.params;
    const { name, category, storage_condition, opened, purchase_date } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const itemId = uuidv4();
    const newItem = {
      id: itemId,
      userId,
      name,
      category: category || null,
      storage_condition: storage_condition || 'fridge',
      opened: opened || false,
      purchase_date: purchase_date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    // Add expiry prediction
    const prediction = predictExpiry(newItem);
    newItem.predicted_expiry = prediction.predicted_expiry;
    newItem.status = prediction.status;

    items.set(itemId, newItem);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
});

// Update item status
router.patch('/:userId/items/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { status } = req.body;
    
    const item = items.get(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (status) {
      item.status = status;
    }

    items.set(itemId, item);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

// Delete item
router.delete('/:userId/items/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const item = items.get(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    items.delete(itemId);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', message: error.message });
  }
});

export default router;
