const router = require('express').Router();
const ctrl = require('../../controllers/softskill.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const multer = require('multer');
const fs = require('fs');

const dir = 'uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(authenticate);

router.get('/', ctrl.list);
router.post('/', authorize('teacher', 'admin'), ctrl.create);
router.post('/submissions/:submissionId/grade', authorize('teacher', 'admin'), ctrl.grade);
router.post('/:skillId/submit', authorize('student'), upload.single('file'), ctrl.submit);
router.get('/:skillId/submissions', authorize('teacher', 'admin'), ctrl.getSubmissions);

module.exports = router;
