const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();
const app = express();

// 1. GATES OPEN: Trust your Vercel link
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'], credentials: true }));

// 2. BIG THROAT: Accept 100MB data packets
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 3. CLOUDINARY CONFIG (Uses your .env keys)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 4. MULTER 100MB GATE: This is the specific fix for your upload error
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'streamnet_final', resource_type: 'video' },
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB Limit
});

// 5. DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// 6. MODELS
const Video = mongoose.model('Video', new mongoose.Schema({
  title: String,
  videoUrl: String,
  createdAt: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// Get all videos
app.get('/api/videos', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

// The 100MB Upload Endpoint
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const newVid = new Video({ title: req.body.title, videoUrl: req.file.path });
    await newVid.save();
    res.status(200).json(newVid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cloudinary Refused File" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server active on ${PORT}`));