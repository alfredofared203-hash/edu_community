require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const { validateAuthConfig } = require('./config/auth');

validateAuthConfig();
connectDB();

const app = express();

// Security & Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/materials', require('./routes/materials'));

// Legacy routes
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// V1 API
app.use('/api/v1', require('./routes/v1'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'المسار غير موجود' }));

// Error handler middleware
app.use(require('./middleware/error.middleware'));

// Socket.IO
const httpServer = http.createServer(app);
const io = initSocket(httpServer);
app.set('io', io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}`));
