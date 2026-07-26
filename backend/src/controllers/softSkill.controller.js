const SoftSkillTask = require('../models/SoftSkillTask');
const SoftSkillSubmission = require('../models/SoftSkillSubmission');

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const teacherId = req.user._id; 

    const task = await SoftSkillTask.create({
      title,
      description,
      deadline,
      teacher: teacherId
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await SoftSkillTask.find().populate('teacher', 'name email');
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { presentationUrl } = req.body;
    const studentId = req.user._id;

    let submission = await SoftSkillSubmission.findOne({ task: taskId, student: studentId });

    if (submission) {
      submission.presentationUrl = presentationUrl;
      submission.status = 'Submitted';
      await submission.save();
    } else {
      submission = await SoftSkillSubmission.create({
        task: taskId,
        student: studentId,
        presentationUrl
      });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const submission = await SoftSkillSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback || submission.feedback;
    submission.status = 'Graded';
    await submission.save();

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};