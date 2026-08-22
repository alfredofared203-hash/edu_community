const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const connectDB = require('./config/db');
require('./config/cloudinary');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const v1Routes = require('./routes/v1');
const postRoutes = require('./routes/post.routes');
const challengeRoutes = require('./routes/challenge.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const adminRoutes = require('./routes/admin.routes');

connectDB();

const app = express();

app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanitize());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.get('/api/health', (req, res) =>
  res.json({ success: true, service: 'EduCommunity Egypt API', version: '1.0', time: new Date() })
);

app.use('/api/v1', v1Routes);
app.use('/api/posts', postRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.port, () =>
  console.log(`🚀 EduCommunity Egypt API running on http://localhost:${env.port}`)
);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;
