// STREAMNET - Database Blueprint
// Author: Ramendra Upadhyay (Roll: 202410101050067)
// I am keeping this schema clean and strict to avoid junk data in MongoDB.

const mongoose = require('mongoose');

const videoBlueprint = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Auto-removes accidental spaces from user input
  },
  videoUrl: {
    type: String,
    required: true, // The actual Cloudinary CDN link
  },
  cloudId: {
    type: String,
    required: true, // Storing this so I can delete files later if needed
  },
  uploadedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VideoRecord', videoBlueprint);
