const express = require('express');

const router = express.Router();

const {
  createTask,
  getTasks,
} = require('../../controllers/softSkillTask.controller');

const {
  authenticate,
  authorize,
} = require('../../middleware/auth.middleware');


 router.post(
  '/',
  authenticate,
  authorize('teacher'),
  createTask
);


 router.get(
  '/',
  authenticate,
  getTasks
);

module.exports = router;