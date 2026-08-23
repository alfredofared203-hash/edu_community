const analyticsService = require('../services/analytics.service');


exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAdminAnalytics();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const userGrade = req.user.grade;
    const data = await analyticsService.getStudentDashboard(userId, userGrade);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


exports.getTeacherDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user._id || req.user.id;
    const data = await analyticsService.getTeacherDashboard(teacherId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};