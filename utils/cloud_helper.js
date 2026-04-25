// STREAMNET - Cloudinary Upload Utility
// Designed by Ramendra Upadhyay
// Separated this logic out so my main server file doesn't get cluttered.

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Secure connection using my .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Async function because cloud uploads take time. 
const pushToCloud = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'video', 
      folder: 'StreamNet_Ramendra', // Creates a neat folder in my dashboard
    });
    return result;
  } catch (err) {
    console.error('Ramendra Cloud Error:', err);
    throw err;
  }
};

module.exports = pushToCloud;