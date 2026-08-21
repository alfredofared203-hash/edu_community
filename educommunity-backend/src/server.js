require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const initSocket = require('./config/socket');

// نوصل بقاعدة البيانات MongoDB
connectDB();

const app = express();

// إعدادات أساسية
app.use(cors());                  // نسمح للفرونت (على بورت تاني) يكلّم الباك
app.use(express.json());          // نقدر نقرأ JSON من جسم الطلب
app.use(morgan('dev'));           // نطبع كل طلب في الكونسول (مفيد للمتابعة)

// الملفات المرفوعة تكون متاحة على /uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===== مسارات الفيز الأولى والتانية =====
app.use('/api/auth', require('./routes/auth'));          // تسجيل / دخول
app.use('/api/subjects', require('./routes/subjects'));  // المواد الدراسية
app.use('/api/materials', require('./routes/materials')); // المواد التعليمية

// ملاحظة: الفيز التالتة والرابعة (الشات/الدروس/السوفت سكيلز/المكافآت)
// هيبنيها التيم طبقاً لخطة العمل.

// ===== مسارات موجودة من قبل =====
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/admin', require('./routes/admin.routes'));


app.use('/api/v1', require('./routes/v1'));


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));


app.use((req, res) => res.status(404).json({ error: 'المسار غير موجود' }));


const httpServer = http.createServer(app);
const io = initSocket(httpServer);
app.set('io', io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}`));
