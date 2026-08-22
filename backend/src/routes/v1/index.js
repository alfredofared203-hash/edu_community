const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication Endpoints
 *   - name: Materials
 *     description: Educational Materials Endpoints
 *   - name: Tasks & SoftSkills
 *     description: Soft Skills & Tasks Management
 *   - name: Chat
 *     description: Real-time & Stream Chat Endpoints
 *   - name: Analytics
 *     description: Admin, Student & Teacher Dashboards
 *   - name: Notifications
 *     description: User System Notifications
 *   - name: Recommendations
 *     description: AI & System Recommendation Engine
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *
 * /materials:
 *   get:
 *     summary: Retrieve study materials
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: List of materials
 *
 * /tasks:
 *   get:
 *     summary: Get user soft skill tasks
 *     tags: [Tasks & SoftSkills]
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *
 * /analytics/admin:
 *   get:
 *     summary: Get overall admin platform metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System metrics data
 *
 * /notifications:
 *   get:
 *     summary: Fetch user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */

// ===== فهرس الإصدار الأول من الـAPI (/api/v1) =====

router.use('/auth', require('../auth')); 
router.use('/materials', require('../materials')); 
router.use('/tasks', require('./softskill.routes')); 
router.use('/chat', require('./chat'));
router.use('/softskills', require('./softskill.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/recommendations', require('./recommendation.routes'));
router.use('/analytics', require('./analytics.routes'));  

module.exports = router;