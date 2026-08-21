const {
  createChallenge,
  listActiveChallenges,
  submitChallenge,
  getLeaderboard,
} = require('../../services/competition/competition.service');
const { validateCreateChallenge, validateSubmitChallenge } = require('../../validators/competition');

async function createChallengeHandler(req, res) {
  const err = validateCreateChallenge(req.body);
  if (err) return res.status(400).json({ error: err });

  try {
    const challenge = await createChallenge(req.body);
    res.status(201).json({ challenge });
  } catch (e) {
    console.error('خطأ في إنشاء التحدي:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء التحدي' });
  }
}

async function listChallengesHandler(req, res) {
  try {
    const { grade, subject } = req.query;
    const challenges = await listActiveChallenges({ grade, subject });
    res.json({ challenges });
  } catch (e) {
    console.error('خطأ في جلب التحديات:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب التحديات' });
  }
}

async function submitChallengeHandler(req, res) {
  const err = validateSubmitChallenge(req.body);
  if (err) return res.status(400).json({ error: err });

  try {
    const { submission, grade } = await submitChallenge({
      challengeId: req.params.id,
      userId: req.user.id,
      answer: req.body.answer,
    });

    // إرسال تحديث الليدربورد عبر Socket.IO
    const io = req.app.get('io');
    if (io) {
      const leaderboard = await getLeaderboard({ grade });
      const room = grade ? `leaderboard_${grade}` : 'leaderboard_global';
      io.to(room).emit('leaderboard_update', { leaderboard, grade });
    }

    res.status(201).json({ submission });
  } catch (e) {
    if (e.code === 'CHALLENGE_CLOSED') return res.status(400).json({ error: e.message });
    if (e.code === 'ALREADY_SUBMITTED') return res.status(409).json({ error: e.message });
    if (e.code === 'NOT_FOUND') return res.status(404).json({ error: e.message });
    console.error('خطأ في تسليم التحدي:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء تسليم الإجابة' });
  }
}

async function getLeaderboardHandler(req, res) {
  try {
    const { grade, limit } = req.query;
    const leaderboard = await getLeaderboard({ grade, limit: limit ? parseInt(limit) : 100 });
    res.json({ leaderboard });
  } catch (e) {
    console.error('خطأ في جلب الليدربورد:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الترتيب' });
  }
}

module.exports = {
  createChallengeHandler,
  listChallengesHandler,
  submitChallengeHandler,
  getLeaderboardHandler,
};
