const mongoose = require('mongoose');

const Submission = require('../models/Submission');
const SoftSkillTask = require('../models/SoftSkillTask');

// Create Submission
const createSubmission = async (req, res) => {
  try {
    const { taskId, fileUrl } = req.body;

    // Validate required fields
    if (!taskId || !fileUrl) {
      return res.status(400).json({
        message: 'taskId and fileUrl are required',
      });
    }

    // Validate taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'invalid task ID',
      });
    }

    // Check if task exists
    const task = await SoftSkillTask.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'not found task with the provided ID',
      });
    }

    // Prevent duplicate submission
    const existingSubmission = await Submission.findOne({
      taskId,
      studentId: req.user._id,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: 'already submitted this task',
      });
    }

    // Create Submission
    const submission = await Submission.create({
      studentId: req.user._id,
      taskId,
      fileUrl,
    });

    return res.status(201).json({
      message: 'submission created successfully',
      submission,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'failed to create submission',
      error: error.message,
    });
  }
};

// Get student's submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      studentId: req.user._id,
    }).populate('taskId');

    return res.status(200).json({
      submissions,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'failed to fetch your submissions',
      error: error.message,
    });
  }
};

// Get submissions for a specific task
const getTaskSubmissions = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'invalid task ID',
      });
    }

    // Check if task exists
    const task = await SoftSkillTask.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'no task found with the provided ID',
      });
    }

    // Make sure the teacher owns the task
    if (
      task.teacherId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          'you are not allowed to view submissions for this task',
      });
    }

    // Get submissions
    const submissions = await Submission.find({
      taskId,
    }).populate('studentId', 'name email');

    return res.status(200).json({
      submissions,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'failed to fetch submissions for the task',
      error: error.message,
    });
  }
};

// Grade Submission
const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    // Validate submission ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'invalid submission ID',
      });
    }

    // Find submission
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({
        message: 'no submission found with the provided ID',
      });
    }

    // Find the task
    const task = await SoftSkillTask.findById(
      submission.taskId
    );

    if (!task) {
      return res.status(404).json({
        message: 'no task found for this submission',
      });
    }

    // Make sure the teacher owns the task
    if (
      task.teacherId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          'you are not allowed to grade this submission',
      });
    }

    // Validate grade
    if (
      typeof grade !== 'number' ||
      grade < 0 ||
      grade > 100
    ) {
      return res.status(400).json({
        message: 'the grade must be a number between 0 and 100',
      });
    }

    // Update grade and feedback
    submission.grade = grade;
    submission.feedback = feedback || '';

    await submission.save();

    return res.status(200).json({
      message: 'successfully graded the submission',
      submission,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'failed to grade the submission',
      error: error.message,
    });
  }
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getTaskSubmissions,
  gradeSubmission,
};