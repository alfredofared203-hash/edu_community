const SoftSkillTask = require('../models/SoftSkillTask');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    grade,
    subject,
    type,
    fileUrl,
    deadline,
  } = req.body;

  const task = await SoftSkillTask.create({
    title,
    description,
    grade,
    subject,
    type,
    fileUrl,
    deadline,
    teacherId: req.user.id,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: 'task created successfully',
    data: task,
  });
});

exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await SoftSkillTask.find()
    .populate('teacherId', 'name email')
    .sort({ createdAt: -1 });

  sendSuccess(res, {
    data: tasks,
  });
});