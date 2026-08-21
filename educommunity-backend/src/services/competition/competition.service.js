const Challenge = require('../../models/Challenge');
const ChallengeSubmission = require('../../models/ChallengeSubmission');
const User = require('../../models/User');

async function createChallenge(data) {
  const challenge = await Challenge.create(data);
  return challenge;
}

async function listActiveChallenges({ grade, subject } = {}) {
  const now = new Date();
  const filter = {
    active: true,
    $or: [{ startDate: { $lte: now } }, { startDate: null }, { startDate: { $exists: false } }],
    $and: [
      { $or: [{ endDate: { $gte: now } }, { endDate: null }, { endDate: { $exists: false } }] },
    ],
  };
  if (grade) filter.grade = grade;
  if (subject) filter.subject = subject;

  return Challenge.find(filter).sort({ endDate: 1 });
}

async function submitChallenge({ challengeId, userId, answer }) {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw Object.assign(new Error('التحدي غير موجود'), { code: 'NOT_FOUND' });
  }
  if (!challenge.isOpen()) {
    throw Object.assign(new Error('التحدي مغلق أو انتهت مدته'), { code: 'CHALLENGE_CLOSED' });
  }

  const duplicate = await ChallengeSubmission.findOne({ challengeId, userId });
  if (duplicate) {
    throw Object.assign(new Error('لقد قمت بحل هذا التحدي مسبقاً'), { code: 'ALREADY_SUBMITTED' });
  }

  const isCorrect = challenge.correctAnswer
    ? answer.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase()
    : false;
  const score = isCorrect ? (challenge.maxScore || 100) : 0;

  const submission = await ChallengeSubmission.create({
    challengeId,
    userId,
    answer,
    score,
    isCorrect,
  });

  if (score > 0) {
    await User.findByIdAndUpdate(userId, { $inc: { points: score } });
  }

  const user = await User.findById(userId).select('grade');
  return { submission, grade: challenge.grade || user?.grade };
}

async function getLeaderboard({ grade, limit = 100 } = {}) {
  const filter = { role: 'student' };
  if (grade) filter.grade = grade;

  const students = await User.find(filter)
    .select('name grade points badges')
    .sort({ points: -1 })
    .limit(limit);

  return students.map((s, i) => ({
    rank: i + 1,
    id: s._id,
    name: s.name,
    grade: s.grade,
    points: s.points,
    badges: s.badges,
  }));
}

module.exports = { createChallenge, listActiveChallenges, submitChallenge, getLeaderboard };
