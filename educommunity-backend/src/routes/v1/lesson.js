const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { bookLessonHandler, getLessons } = require('../../controllers/lesson/lesson.controller');

router.post('/book', authenticate, authorize('student'), bookLessonHandler);
router.get('/', authenticate, getLessons);

module.exports = router;
