// STREAMNET UPLOAD ENGINE | Premium Glassmorphism Edition
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StreamUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('NEWS');
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setErrorMessage('Please provide a title and a video file.');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('category', category);

    try {
      // NOTE: Using the live Render URL. The timeout is extended for Render's "Cold Start"
      await axios.post('https://streamnet-final.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100000 // 100 seconds to allow Render to wake up from sleep
      });
      
      setStatus('success');
      setTimeout(() => navigate('/'), 2000); // Route back to home after 2 seconds
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Network timeout: The Render backend is waking up. Please try clicking Deploy again in 30 seconds.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>StreamNet</h1>
        <button style={styles.backBtn} onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>

      <div style={styles.uploadWrapper}>
        <div style={styles.uploadCard}>
          <h2 style={styles.header}>Deploy Secure Video</h2>
          <p style={styles.subHeader}>Encrypted transfer to Cloudinary nodes.</p>

          <form onSubmit={handleUpload} style={styles.form}>
            {/* Title Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Video Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter a secure title..." 
                style={styles.input} 
              />
            </div>

            {/* Category Dropdown */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Category Network</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                style={styles.input}
              >
                {['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY'].map(cat => (
                  <option key={cat} value={cat} style={{background: '#111'}}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Zone Simulation */}
            <div style={styles.dropZone}>
              <p style={{color: '#a855f7', fontWeight: 'bold', margin: '0 0 10px 0'}}>
                {file ? `Selected: ${file.name}` : 'Click to select an MP4 file'}
              </p>
              <input 
                type="file" 
                accept="video/mp4,video/x-m4v,video/*" 
                onChange={handleFileChange} 
                style={styles.fileInput} 
              />
            </div>

            {/* Status Messages */}
            {status === 'error' && <div style={styles.errorBox}>❌ {errorMessage}</div>}
            {status === 'success' && <div style={styles.successBox}>✅ Deployment Successful! Rerouting...</div>}

            {/* Deploy Button */}
            <button 
              type="submit" 
              style={status === 'uploading' ? styles.btnUploading : styles.btnDeploy}
              disabled={status === 'uploading'}
            >
              {status === 'uploading' ? 'INITIALIZING TRANSFER...' : 'DEPLOY TO STREAMNET'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- PREMIUM NEON CSS ---
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" },
  navBar: { display: 'flex', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #222' },
  logo: { margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff', textShadow: '0 0 10px #a855f7', cursor: 'pointer' },
  backBtn: { background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  
  uploadWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' },
  uploadCard: { background: '#0a0a0a', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '550px', border: '1px solid rgba(168, 85, 247, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' },
  header: { margin: '0 0 5px 0', fontSize: '26px', color: '#fff' },
  subHeader: { margin: '0 0 30px 0', fontSize: '14px', color: '#666' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' },
  input: { padding: '15px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', transition: 'border 0.3s', '&:focus': { border: '1px solid #06b6d4' } },
  
  dropZone: { border: '2px dashed #333', padding: '40px 20px', textAlign: 'center', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.05)', cursor: 'pointer', position: 'relative' },
  fileInput: { width: '100%', color: '#888', cursor: 'pointer' },
  
  btnDeploy: { padding: '16px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '900', fontSize: '16px', cursor: 'pointer', marginTop: '10px', transition: 'transform 0.1s' },
  btnUploading: { padding: '16px', background: '#333', border: 'none', borderRadius: '8px', color: '#888', fontWeight: '900', fontSize: '16px', cursor: 'not-allowed', marginTop: '10px' },
  
  errorBox: { padding: '12px', background: 'rgba(255, 50, 50, 0.1)', border: '1px solid #ff3333', borderRadius: '6px', color: '#ff3333', fontSize: '14px', textAlign: 'center' },
  successBox: { padding: '12px', background: 'rgba(50, 255, 100, 0.1)', border: '1px solid #32ff64', borderRadius: '6px', color: '#32ff64', fontSize: '14px', textAlign: 'center' }
};

export default StreamUpload;