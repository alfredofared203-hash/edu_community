const router = require('express').Router();
const softSkillRoutes = require('../softSkill.routes');  
router.use('/auth', require('./auth.routes'));
router.use('/subjects', require('./subject.routes'));
router.use('/materials', require('./material.routes'));
router.use('/teachers', require('./teacher.routes'));
router.use('/soft-skills', softSkillRoutes);
module.exports = router;