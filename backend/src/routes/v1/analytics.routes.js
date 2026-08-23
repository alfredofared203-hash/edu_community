const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/analytics.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');


router.use(authenticate);


router.get('/admin', authorize('admin', 'supervisor'), analyticsController.getAdminAnalytics);


router.get('/student', authorize('student'), analyticsController.getStudentDashboard);


router.get('/teacher', authorize('teacher'), analyticsController.getTeacherDashboard);

module.exports = router;