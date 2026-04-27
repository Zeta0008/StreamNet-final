// STREAMNET UPLOAD ENGINE | Premium Edition
// Author: Ramendra Upadhyay
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StreamUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle'); // idle, waking, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setErrorMessage('Please provide a title and select a video file.');
      setStatus('error');
      return;
    }

    // Stage 1: Assume Render is sleeping and warn the user
    setStatus('waking');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      // Stage 2: The actual upload with a massive timeout
      const response = await axios.post('https://streamnet-final.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000 // 120 seconds! This gives Render plenty of time to wake up
      });
      
      setStatus('success');
      setTimeout(() => navigate('/'), 2000); // Reroute to home after 2 seconds
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Server timeout. Render is waking up. Please click Deploy again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadCard}>
        <h1 style={styles.logo}>StreamNet</h1>
        <p style={styles.subtext}>MCA PROJECT - RAMENDRA UPADHYAY</p>

        <form onSubmit={handleUpload} style={styles.form}>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter Video Title..." 
            style={styles.input} 
          />

          <div style={styles.fileWrapper}>
            <input 
              type="file" 
              accept="video/mp4,video/x-m4v,video/*" 
              onChange={handleFileChange} 
              style={styles.fileInput} 
              id="file-upload"
            />
            <label htmlFor="file-upload" style={styles.fileLabel}>
              {file ? `Selected: ${file.name}` : 'Choose Video File'}
            </label>
          </div>

          {/* Dynamic Status Messages */}
          {status === 'error' && <div style={styles.errorBox}>❌ {errorMessage}</div>}
          {status === 'waking' && <div style={styles.warningBox}>⏳ Waking up StreamNet nodes... This may take 50 seconds.</div>}
          {status === 'success' && <div style={styles.successBox}>✅ Deployment Successful! Rerouting...</div>}

          {/* Smart Deploy Button */}
          <button 
            type="submit" 
            style={status === 'waking' ? styles.btnUploading : styles.btnDeploy}
            disabled={status === 'waking'}
          >
            {status === 'waking' ? 'INITIALIZING TRANSFER...' : 'Deploy Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- POLISHED CSS ---
const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505', fontFamily: "'Inter', sans-serif" },
  uploadCard: { background: '#111', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '450px', border: '1px solid #222', boxShadow: '0 20px 50px rgba(0,0,0,0.9)', textAlign: 'center' },
  logo: { margin: '0 0 5px 0', fontSize: '32px', fontWeight: '900', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.3)' },
  subtext: { margin: '0 0 30px 0', fontSize: '12px', color: '#888', letterSpacing: '1px' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  input: { padding: '16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '16px', outline: 'none' },
  
  fileWrapper: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px' },
  fileInput: { display: 'none' },
  fileLabel: { flex: 1, color: '#aaa', cursor: 'pointer', padding: '8px', background: '#333', borderRadius: '4px', fontSize: '14px', transition: 'background 0.2s' },
  
  btnDeploy: { padding: '16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s' },
  btnUploading: { padding: '16px', background: '#333', border: 'none', borderRadius: '8px', color: '#888', fontWeight: 'bold', fontSize: '16px', cursor: 'not-allowed' },
  
  errorBox: { padding: '12px', background: 'rgba(255, 50, 50, 0.1)', border: '1px solid #ff3333', borderRadius: '6px', color: '#ff3333', fontSize: '14px' },
  warningBox: { padding: '12px', background: 'rgba(255, 165, 0, 0.1)', border: '1px solid orange', borderRadius: '6px', color: 'orange', fontSize: '14px' },
  successBox: { padding: '12px', background: 'rgba(50, 255, 100, 0.1)', border: '1px solid #32ff64', borderRadius: '6px', color: '#32ff64', fontSize: '14px' }
};

export default StreamUpload;