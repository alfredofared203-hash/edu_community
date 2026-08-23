const router = require('express').Router();

const {
  createSubmission,
  getMySubmissions,
  getTaskSubmissions,
  gradeSubmission,
} = require('../../controllers/submission.controller');

const {
  authenticate,
  authorize,
} = require('../../middleware/auth.middleware');

router.post(
  '/',
  authenticate,
  authorize('student'),
  createSubmission
);

router.get(
  '/',
  authenticate,
  authorize('student'),
  getMySubmissions
);

router.get(
  '/task/:taskId',
  authenticate,
  authorize('teacher'),
  getTaskSubmissions
);

router.patch(
  '/:id/grade',
  authenticate,
  authorize('teacher'),
  gradeSubmission
);

module.exports = router;