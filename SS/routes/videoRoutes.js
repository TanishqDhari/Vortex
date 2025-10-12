const express = require('express');
const upload = require('../middleware/upload');
const { uploadVideo, listVideos, serveHLS } = require('../controllers/videoController');

const router = express.Router();

router.post('/upload/:id', upload.single('video'), uploadVideo);
router.get('/list', listVideos);
router.get('/hls/:videoId/:file', serveHLS);

module.exports = router;