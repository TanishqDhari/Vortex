const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const path = require('path');

// Resolutions and bitrates for adaptive streaming
const resolutions = [
  { res: '320x180', vBitrate: '500k', aBitrate: '64k' },
  { res: '854x480', vBitrate: '1000k', aBitrate: '128k' },
  { res: '1280x720', vBitrate: '2500k', aBitrate: '192k' }
];

const getBandwidth = (res) => {
  if (res === '320x180') return 676800;
  if (res === '854x480') return 1353600;
  if (res === '1280x720') return 3230400;
};

const transcodeToHLS = async (inputPath, videoId) => {
  const hlsDir = path.join(__dirname, '..', 'hls', videoId);
  await fs.ensureDir(hlsDir);

  const masterPlaylist = ['#EXTM3U', '#EXT-X-VERSION:3'];

  for (const { res, vBitrate, aBitrate } of resolutions) {
    const variantFile = `${videoId}_${res}.m3u8`;
    const variantPath = path.join(hlsDir, variantFile);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v h264',
          `-vf scale=${res}`,
          `-b:v ${vBitrate}`,
          '-c:a aac',
          `-b:a ${aBitrate}`,
          '-f hls',
          '-hls_time 10', // Segment duration
          '-hls_playlist_type vod',
          '-hls_segment_filename', path.join(hlsDir, `${videoId}_${res}_%03d.ts`)
        ])
        .output(variantPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    masterPlaylist.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${getBandwidth(res)},RESOLUTION=${res}`,
      variantFile
    );
  }

  const masterPath = path.join(hlsDir, `${videoId}.m3u8`);
  await fs.writeFile(masterPath, masterPlaylist.join('\n'));

  // Clean up original upload
  await fs.remove(inputPath);
};

module.exports = { transcodeToHLS };