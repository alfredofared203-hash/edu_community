const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const {
  createChallengeHandler,
  listChallengesHandler,
  submitChallengeHandler,
  getLeaderboardHandler,
} = require('../../controllers/competition/competition.controller');

router.post('/', authenticate, authorize('teacher', 'admin'), createChallengeHandler);
router.get('/', authenticate, listChallengesHandler);
router.post('/:id/submit', authenticate, authorize('student'), submitChallengeHandler);
router.get('/leaderboard', authenticate, getLeaderboardHandler);

module.exports = router;
