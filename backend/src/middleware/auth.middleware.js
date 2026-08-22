const jwt = require('jsonwebtoken');

const env = require('../config/env');

const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(
      ApiError.unauthorized('the token is required')
    );
  }

  try {
    const token = header.split(' ')[1];

    const decoded = jwt.verify(
      token,
      env.jwt.accessSecret
    );

    // توحيد اسم الـ ID داخل req.user
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id,
    };

    next();
  } catch (err) {
    return next(
      ApiError.unauthorized(
        'the token is invalid or expired'
      )
    );
  }
};

// authorize('teacher', 'admin')
// يسمح فقط للأدوار المحددة
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(
      ApiError.forbidden('not allowed for this role')
    );
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
};