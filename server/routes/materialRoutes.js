const express = require('express');
const router = express.Router();
const { getMaterials, uploadMaterial, getMaterialById, toggleLike, addComment } = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getMaterials)
    .post(protect, upload.single('file'), uploadMaterial);

router.route('/:id')
    .get(getMaterialById);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;
