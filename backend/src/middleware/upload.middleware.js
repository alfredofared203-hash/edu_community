<<<<<<< HEAD
const multer = require('multer');
const fs = require('fs');

// نتأكد إن فولدر uploads موجود، ولو مش موجود نعمله
const dir = 'uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// نحفظ الملف على القرص باسم فريد (الوقت + اسم الملف الأصلي)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

// أنواع الملفات المسموح بها (PDF / صور / فيديو / بريزنتيشن)
const allowed = [
  'application/pdf',
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
  'video/mp4', 'video/webm',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

function fileFilter(req, file, cb) {
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('نوع الملف غير مسموح'));
}

// أقصى حجم للملف = 10 ميجا
module.exports = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
=======
// إعداد multer لاستقبال الملفات على القرص مؤقتاً (يستخدمه upload.service بعدها).
// نخزّن على القرص عشان الرفع لـCloudinary أو التخزين المحلي يشتغلا بنفس الطريقة.
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const uploadDir = env.uploadDir;
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// أنواع الملفات المسموح بها (PDF / صور / فيديو)
const allowed = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'video/mp4',
  'video/webm',
];

const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(ApiError.badRequest('نوع الملف غير مدعوم (PDF أو صورة أو فيديو فقط)'));
};

module.exports = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter,
});
>>>>>>> backend2
