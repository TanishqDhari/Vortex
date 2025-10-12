const fs = require('fs-extra');
const path = require('path');
const { transcodeToHLS } = require('../utils/ffmpeg');

exports.uploadVideo = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  const videoId = req.params.id;
  if(!videoId) return res.json({msg: "No videoId found"});

  // Start transcoding in background
  transcodeToHLS(req.file.path, videoId)
    .then(() => console.log(`Transcoding complete for ${videoId}`))
    .catch(err => console.error(`Transcoding error for ${videoId}:`, err));

  res.json({ msg: 'Upload received, transcoding started', videoId });
};

exports.listVideos = async (req, res) => {
  const hlsDir = path.join(__dirname, '..', 'hls');
  const folders = await fs.readdir(hlsDir, { withFileTypes: true });
  const videos = folders
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name); // videoIds

  res.json({ videos });
};

exports.serveHLS = async (req, res) => {
  const { videoId, file } = req.params;
  const filePath = path.join(__dirname, '..', 'hls', videoId, file);

  if (await fs.pathExists(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ msg: 'File not found' });
  }
};