import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { generalRateLimiter, authRateLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import foodItemsRoutes from './routes/foodItems.routes';
import subscriptionsRoutes from './routes/subscriptions.routes';
import notificationsRoutes from './routes/notifications.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Trust proxy for Render load balancers so rate limiter gets correct IPs
app.set('trust proxy', 1);

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiters
app.use(generalRateLimiter);

// Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRateLimiter, authRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/food-items', foodItemsRoutes);
apiRouter.use('/subscriptions', subscriptionsRoutes);
apiRouter.use('/notifications', notificationsRoutes);
apiRouter.use('/admin', adminRoutes);

app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

export default app;
