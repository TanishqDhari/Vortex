const express = require('express');
const upload = require('../middleware/upload');
const { uploadVideo, listVideos, serveHLS } = require('../controllers/videoController');

const router = express.Router();

router.post('/upload', upload.single('video'), uploadVideo);
router.get('/list', listVideos);
router.get('/hls/:videoId/:file', serveHLS); // Serves .m3u8 and .ts

module.exports = router;