const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const { getJwtSecret } = require('../config/auth');
const ApiError = require('../utils/ApiError');


function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('the token is required'));
  }
  try {
    const token = header.split(' ')[1];          
    req.user = jwt.verify(token, getJwtSecret());
    next();                                       
  } catch (e) {
    res.status(401).json({ error: 'توكن غير صالح أو منتهي' });
  }
}
/* function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'لا تملك صلاحية لهذا الإجراء' });
    }
    next();
  } catch (err) {
    next(ApiError.unauthorized('the token is invalid or expired'));
  }
};

*/
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('not allowed for this role'));
  }
  next();
};

module.exports = { authenticate, authorize };
=======

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
>>>>>>> backend2
