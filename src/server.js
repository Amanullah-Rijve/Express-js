import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes.js';
import studentRoutes from './routes/student.routes.js';
import orderRoutes from './routes/order.routes.js';
import logger from './middlewares/logger.middleware.js';
import notFound from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// ─── Global Middleware ────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(logger);

// ─── Routes ──────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend Journey API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      students: '/api/students',
      orders: '/api/orders'
    }
  });
});

app.use('/api/products', productRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/orders', orderRoutes);

// ─── Error Middleware (সবার শেষে) ────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server চলছে: http://localhost:${PORT}`);
});