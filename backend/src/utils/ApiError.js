class ApiError extends Error {
<<<<<<< HEAD
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode; // كود HTTP (400 / 401 / 403 / 404 / 409 ...)
    this.isOperational = true;    // خطأ متوقّع إحنا رميناه، مش باج في السيرفر
  }

  // دوال مختصرة لأشهر الأخطاء
  static badRequest(message) { return new ApiError(400, message); }
  static unauthorized(message) { return new ApiError(401, message); }
  static forbidden(message) { return new ApiError(403, message); }
  static notFound(message) { return new ApiError(404, message); }
  static conflict(message) { return new ApiError(409, message); }
=======
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // خطأ متوقّع (مش bug في السيرفر)
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'طلب غير صالح', errors = null) {
    return new ApiError(400, message, errors);
  }
  static unauthorized(message = 'غير مصرّح') {
    return new ApiError(401, message);
  }
  static forbidden(message = 'لا تملك صلاحية الوصول') {
    return new ApiError(403, message);
  }
  static notFound(message = 'غير موجود') {
    return new ApiError(404, message);
  }
  static conflict(message = 'تعارض في البيانات') {
    return new ApiError(409, message);
  }
  static validation(errors, message = 'بيانات غير صالحة') {
    return new ApiError(422, message, errors);
  }
>>>>>>> backend2
}

module.exports = ApiError;
