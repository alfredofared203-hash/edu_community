const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  submitTask,
  gradeSubmission
} = require('../controllers/softSkill.controller'); 

router.route('/')
  .get(getTasks)
  .post(createTask);

router.post('/:taskId/submit', submitTask);
router.patch('/submissions/:submissionId/grade', gradeSubmission);

module.exports = router;
