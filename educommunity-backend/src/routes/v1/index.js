const router = require('express').Router();


router.use('/chat', require('./chat'));
router.use('/notifications', require('./notification'));
router.use('/lessons', require('./lesson'));
router.use('/competitions', require('./competition'));

module.exports = router;
