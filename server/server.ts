import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook';
import userRoutes from './routes/users';

dotenv.config();

const app = express();

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);

app.use('/webhook', webhookRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Cloudflare Telegram Bot API',
    version: '1.0.0',
    endpoints: {
      webhook: {
        POST: '/webhook',
        GET: '/webhook'
      },
      users: {
        POST: '/api/users',
        GET: '/api/users',
        GET_BY_ID: '/api/users/:telegramId',
        DELETE: '/api/users/:telegramId'
      }
    }
  });
});

const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
};

app.use(errorHandler);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;