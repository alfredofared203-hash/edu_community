require('dotenv').config();
<<<<<<< HEAD
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
const setupSwagger = require('./config/swagger');

validateAuthConfig();
=======
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const connectDB = require('./config/db');
require('./config/cloudinary'); // تهيئة Cloudinary
const { notFound, errorHandler } = require('./middleware/error.middleware');

// مسارات الإصدار الأول (المعمار الجديد)
const v1Routes = require('./routes/v1');

// مسارات قديمة (لسه شغّالة — تم ترحيل مسار المدرسين بنجاح)
const postRoutes = require('./routes/post.routes');
const challengeRoutes = require('./routes/challenge.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const adminRoutes = require('./routes/admin.routes');  

>>>>>>> backend2
connectDB();

const app = express();

<<<<<<< HEAD
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
setupSwagger(app);

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
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/lessons', require('./routes/lesson.routes'));
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
=======
 app.use(helmet());
app.use(cors({ origin: env.nodeEnv === 'production' ? env.clientUrl : true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

 app.use(
  rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false })
);

 app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// فحص صحة الخدمة
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
  console.log(` EduCommunity Egypt API running on http://localhost:${env.port}`)
);

 process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;
>>>>>>> backend2
