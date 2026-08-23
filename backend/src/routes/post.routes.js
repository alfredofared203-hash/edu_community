<<<<<<< HEAD
=======
// routes/post.routes.js
>>>>>>> backend2
const router = require('express').Router();
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', postController.getPosts);
router.post('/', authenticate, upload.single('file'), postController.createPost);
router.post('/:id/like', authenticate, postController.likePost);
<<<<<<< HEAD
router.get('/:id/comments', postController.getComments);
router.post('/:id/comments', authenticate, postController.addComment);

module.exports = router;
=======
router.get('/:id/comments', postController.getComments); // تحتاج لإنشاء دالة getComments في الـ Controller
router.post('/:id/comments', authenticate, postController.addComment);

module.exports = router;
>>>>>>> backend2
