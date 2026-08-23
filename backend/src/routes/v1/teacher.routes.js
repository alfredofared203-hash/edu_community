<<<<<<< HEAD
=======
// routes/teacherRoutes.js
>>>>>>> backend2
const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacherrating.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.get('/', teacherController.getTeachers);

router.post('/:id/rate', 
  authenticate, 
  authorize('student'), 
  teacherController.rateTeacher
);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> backend2
