const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs-extra');
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();

// Create required directories
const ensureDirectories = async () => {
  await fs.ensureDir('uploads');
  await fs.ensureDir('hls');
};

ensureDirectories().catch(console.error);

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/api/videos/upload`);
});