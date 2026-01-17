import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import aiRoutes from './routes/ai.js';
import sustainabilityRoutes from './routes/sustainability.js';
import nutritionRoutes from './routes/nutrition.js';
import mealplanRoutes from './routes/mealplan.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5175', 'http://127.0.0.1:5175'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'FoodSaver AI API',
    version: '2.0.0',
    status: 'running',
    backend: 'Express.js',
    docs: '/api/docs'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/users', itemsRoutes);
app.use('/ai-suggestions', aiRoutes);
app.use('/sustainability', sustainabilityRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/mealplan', mealplanRoutes);
app.use('/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FoodSaver AI Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});
