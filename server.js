const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();
const app = express();

// 1. GATES OPEN: Fixes CORS so Vercel can talk to Render
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));

// 2. BIG THROAT: Allows the server to receive 100MB data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 3. CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 4. MULTER 100MB LIMIT (The "Gatekeeper")
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'streamnet_uploads', resource_type: 'video' },
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB exactly
});

// 5. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// 6. THE VIDEO MODEL (Inline if not using the folder)
const Video = mongoose.model('Video', new mongoose.Schema({
  title: String,
  videoUrl: String,
  createdAt: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// GET: Fetch all videos for the grid
app.get('/api/videos', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

// POST: The 100MB Upload Route
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    const newVideo = new Video({ title: req.body.title, videoUrl: req.file.path });
    await newVideo.save();
    res.status(200).json(newVideo);
  } catch (error) {
    res.status(500).json({ error: "Upload Failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));