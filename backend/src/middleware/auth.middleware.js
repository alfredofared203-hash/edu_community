const jwt = require('jsonwebtoken');
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
