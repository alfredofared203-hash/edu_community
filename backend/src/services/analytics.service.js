const User = require('../models/User');
const Challenge = require('../models/Challenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const Material = require('../models/Material');


exports.getAdminAnalytics = async () => {
  const usersByRoleAgg = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
  
  const usersByRole = usersByRoleAgg.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  const totalStudents = usersByRole.student || 0;
  const totalTeachers = usersByRole.teacher || 0;
  const totalMaterials = await Material.countDocuments();
  const activeChallenges = await Challenge.countDocuments({ active: true });
  const totalSubmissions = await ChallengeSubmission.countDocuments();

  const challengeStats = await Challenge.aggregate([
    {
      $lookup: {
        from: 'challengesubmissions',
        localField: '_id',
        foreignField: 'challengeId',
        as: 'submissions',
      },
    },
    {
      $project: {
        title: 1,
        grade: 1,
        points: 1,
        submissionsCount: { $size: '$submissions' },
      },
    },
    { $sort: { submissionsCount: -1 } },
    { $limit: 5 },
  ]);

  return {
    overview: {
      totalStudents,
      totalTeachers,
      totalMaterials,
      activeChallenges,
      totalSubmissions,
    },
    usersByRole,
    topChallenges: challengeStats,
  };
};


exports.getStudentDashboard = async (userId, userGrade) => {
  const user = await User.findById(userId).select('name grade points badges');
  const solvedChallengesCount = await ChallengeSubmission.countDocuments({ userId });
  const materialsCount = await Material.countDocuments({ grade: userGrade });
  const activeChallengesCount = await Challenge.countDocuments({ active: true, grade: userGrade });

  const higherStudentsCount = await User.countDocuments({
    role: 'student',
    points: { $gt: user ? user.points : 0 },
  });
  const rank = higherStudentsCount + 1;

  return {
    user,
    stats: {
      points: user ? user.points : 0,
      badgesCount: user && user.badges ? user.badges.length : 0,
      solvedChallenges: solvedChallengesCount,
      rank,
      availableMaterials: materialsCount,
      activeChallenges: activeChallengesCount,
    },
  };
};


exports.getTeacherDashboard = async (teacherId) => {
  const uploadedMaterials = await Material.find({ uploadedBy: teacherId })
    .populate('subject', 'name grade')
    .sort({ createdAt: -1 });

  return {
    stats: {
      totalUploadedMaterials: uploadedMaterials.length,
    },
    recentMaterials: uploadedMaterials.slice(0, 5),
  };
};