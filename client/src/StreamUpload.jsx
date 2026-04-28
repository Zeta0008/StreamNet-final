import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StreamUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle'); 

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Title and Video required.");

    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      // MASSIVE TIMEOUT FIX: Tells the browser to wait up to 2 minutes for Render
      await axios.post('https://streamnet-final.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000 
      });
      setStatus('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{color: '#fff', textAlign: 'center'}}>Deploy Secure Video</h2>
        
        <form onSubmit={handleUpload} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <input 
            type="text" 
            placeholder="Video Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={styles.input} 
          />
          
          <input 
            type="file" 
            accept="video/*" 
            onChange={e => setFile(e.target.files[0])} 
            style={styles.fileInput} 
          />

          {status === 'error' && <p style={{color: 'red'}}>Upload failed. Try again.</p>}
          {status === 'success' && <p style={{color: 'green'}}>Success! Rerouting...</p>}

          <button 
            type="submit" 
            disabled={status === 'uploading'}
            style={status === 'uploading' ? styles.btnDisabled : styles.btn}
          >
            {status === 'uploading' ? 'Encrypting & Uploading...' : 'Upload Video'}
          </button>
          
          <button type="button" onClick={() => navigate('/')} style={styles.btnOutline}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

// RESPONSIVE CSS
const styles = {
  page: { minHeight: '100vh', backgroundColor: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  // Max-width 400px ensures it looks like a card on desktop, but width 100% makes it shrink on Android
  card: { width: '100%', maxWidth: '400px', backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' },
  input: { width: '100%', padding: '12px', boxSizing: 'border-box', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '6px' },
  fileInput: { color: '#aaa' },
  btn: { padding: '15px', backgroundColor: '#06b6d4', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnDisabled: { padding: '15px', backgroundColor: '#444', color: '#888', border: 'none', borderRadius: '6px' },
  btnOutline: { padding: '15px', backgroundColor: 'transparent', color: '#888', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }
};

export default StreamUpload;