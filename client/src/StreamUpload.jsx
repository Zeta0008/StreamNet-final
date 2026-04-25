// STREAMNET - Frontend Portal | Author: Ramendra Upadhyay


import React, { useState } from 'react';
import axios from 'axios';

const StreamUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a video first!");

    const data = new FormData();
    data.append('videoFile', file);
    data.append('title', title);

    setStatus("Uploading to Ramendra's Cloud...");

    try {
      // Sending data to our Backend on Port 5000
      await axios.post('http://localhost:5000/api/upload-video', data);
      setStatus("✅ Success! Video is live on Cloudinary.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: Is the backend running?");
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.box}>
        <h2 style={styles.head}>StreamNet</h2>
        <p style={styles.sub}>MCA Project - Ramendra Upadhyay</p>
        <form onSubmit={handleUpload} style={styles.form}>
          <input 
            type="text" 
            placeholder="Video Title" 
            onChange={(e) => setTitle(e.target.value)} 
            style={styles.input} 
          />
          <input 
            type="file" 
            accept="video/*" 
            onChange={(e) => setFile(e.target.files[0])} 
            style={styles.file} 
          />
          <button type="submit" style={styles.btn}>Deploy Video</button>
        </form>
        {status && <p style={styles.statusText}>{status}</p>}
      </div>
    </div>
  );
};

// Personalized Dark Theme CSS
const styles = {
  bg: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' },
  box: { background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', textAlign: 'center', width: '350px' },
  head: { color: '#fff', fontSize: '32px', margin: '0' },
  sub: { color: '#555', fontSize: '10px', textTransform: 'uppercase', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' },
  file: { color: '#777', fontSize: '12px' },
  btn: { padding: '12px', background: '#3ea6ff', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  statusText: { color: '#4ade80', marginTop: '15px', fontSize: '13px' }
};

export default StreamUpload;