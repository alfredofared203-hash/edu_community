<<<<<<< HEAD
const ApiError = require('../utils/ApiError');
const { sendError } = require('../utils/apiResponse');

// معالج الأخطاء المركزي — آخر middleware في السيرفر.
// أي throw في أي كنترولر بيوصل هنا (عن طريق asyncHandler → next(err)).
// فايدته: كل الأخطاء بتطلع بنفس الشكل، ومفيش try/catch مكرّر.
function errorMiddleware(err, req, res, next) {
  // 1) أخطاء إحنا رميناها بنفسنا (ApiError) — نرجّعها زي ما هي
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message);
  }

  // 2) Mongoose: id شكله غلط
  if (err.name === 'CastError') {
    return sendError(res, 400, 'المعرّف (id) غير صحيح');
  }

  // 3) Mongoose: بيانات مش مطابقة للـ schema
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return sendError(res, 400, first?.message || 'بيانات غير صحيحة');
  }

  // 4) قيمة مكرّرة في حقل unique (مثلاً بريد مسجّل)
  if (err.code === 11000) {
    return sendError(res, 409, 'هذه القيمة مسجّلة من قبل');
  }

  // 5) أي حاجة تانية = باج غير متوقّع
  console.error('❌ خطأ غير متوقّع:', err);
  return sendError(res, 500, 'حصل خطأ في السيرفر');
}

module.exports = errorMiddleware;
=======
// معالج الأخطاء المركزي + معالج 404. بيحوّل أي خطأ لرد JSON منظّم.
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

// المسار غير موجود
const notFound = (req, res, next) => {
  next(new ApiError(404, `المسار غير موجود: ${req.originalUrl}`));
};

// المعالج المركزي (لازم يكون آخر middleware)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'خطأ في الخادم';
  let errors = err.errors || null;

  // أخطاء Mongoose الشائعة نترجمها لرسائل واضحة
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'معرّف غير صالح';
  }
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'بيانات غير صالحة';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `القيمة مستخدمة من قبل: ${field}` : 'القيمة مستخدمة من قبل';
  }
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'توكن غير صالح';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'انتهت صلاحية التوكن';
  }

  if (statusCode === 500 && env.nodeEnv !== 'production') {
    console.error('💥', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: message, // للتوافق مع الكود القديم في الفرونت
    ...(errors ? { errors } : {}),
    ...(env.nodeEnv !== 'production' && statusCode === 500 ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
>>>>>>> backend2
