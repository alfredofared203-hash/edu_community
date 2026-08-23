const router = require('express').Router();
const challengeController = require('../controllers/challenge.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', challengeController.getChallenges);
router.get('/submissions', authenticate, challengeController.getSubmissions);
router.post('/:id/submit', authenticate, challengeController.submitChallenge);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> backend2
