import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import authRoutes from './routes/auth';
import listingsRoutes from './routes/listings';
import threadsRoutes from './routes/threads';
import transactionsRoutes from './routes/transactions';
import adminRoutes from './routes/admin';
import requestsRoutes from './routes/requests';
import notificationsRoutes from './routes/notifications';
import { initSocket } from './socket/chat';

const app = express();
const httpServer = createServer(app);

const PORT = parseInt(process.env.PORT || '4000', 10);
const FRONTEND_URLS = [
  'http://localhost:3000',
  'https://muj-mart.vercel.app',
  'https://www.mujmart.in',
  'https://mujmart.in',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

// ─────────────────────────────────────────────
// Socket.io
// ─────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: FRONTEND_URLS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
initSocket(io);

// ─────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow image serving
  })
);
app.use(
  cors({
    origin: FRONTEND_URLS,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─────────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter for auth
  message: { error: 'Too many auth attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// ─────────────────────────────────────────────
// File Upload (Images to Cloudinary)
// ─────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isDoc = file.mimetype.includes('pdf') || 
                  file.mimetype.includes('document') || 
                  file.mimetype.includes('msword') || 
                  file.mimetype.includes('powerpoint') || 
                  file.mimetype.includes('presentation');
    return {
      folder: 'mujmart',
      resource_type: isDoc ? 'raw' : 'auto',
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB to allow for PPT/PDFs
});

// Serve local uploads statically just in case old listings reference them
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  // req.file.path contains the Cloudinary secure_url when using CloudinaryStorage
  res.json({ url: req.file.path, filename: req.file.filename });
});

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/threads', threadsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'File too large. Maximum 10MB allowed.' });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log('\n🛒 MUJMart Backend running!');
    console.log(`   API:     http://localhost:${PORT}/api`);
    console.log(`   Health:  http://localhost:${PORT}/api/health`);
    console.log(`   Uploads: http://localhost:${PORT}/uploads`);
    console.log(`   Socket:  ws://localhost:${PORT}`);
    console.log(`   Mode:    ${process.env.NODE_ENV || 'development'}\n`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default app;
