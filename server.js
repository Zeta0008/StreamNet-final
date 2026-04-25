// ==========================================
// STREAMNET MAIN BACKEND ENGINE
// Lead Developer: Ramendra Upadhyay
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');

// Importing my custom blueprints and tools
const VideoDB = require('./models/Video');
const pushToCloud = require('./utils/cloud_helper');

dotenv.config();
const app = express();

app.use(cors()); 
app.use(express.json());

// Using multer to temporarily catch the video in server memory
const uploadCatcher = multer({ dest: 'temp_uploads/' }); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ramendra Database Linked Successfully'))
  .catch((err) => console.error('❌ DB Connection Failed:', err));

// --- THE UPLOAD ROUTE ---
app.post('/api/upload-video', uploadCatcher.single('videoFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file detected by server.' });
    }

    // 1. Send the caught file to Cloudinary
    const cloudData = await pushToCloud(req.file.path);

    // 2. Map the cloud data to my database blueprint
    const newVideo = new VideoDB({
      title: req.body.title || 'StreamNet_Default_Title',
      videoUrl: cloudData.secure_url,
      cloudId: cloudData.public_id,
    });

    // 3. Save to MongoDB
    const savedRecord = await newVideo.save();
    
    // 4. Send success back to React
    res.status(200).json(savedRecord);

  } catch (error) {
    console.error('Upload Pipeline Failure:', error);
    res.status(500).json({ message: 'Server crash during video process.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StreamNet Backend Active on Port ${PORT} | Authored by Ramendra`);
});