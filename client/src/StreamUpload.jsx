import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StreamUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle');

  const uploadVideo = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Title and Video required.");
    setStatus('loading');

    const fd = new FormData();
    fd.append('video', file);
    fd.append('title', title);

    try {
      // 5 MINUTE TIMEOUT: Browser will wait for the 100MB transfer to finish
      await axios.post('https://streamnet-final.onrender.com/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000 
      });
      setStatus('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'}}>
      <div style={{width: '100%', maxWidth: '400px', background: '#111', padding: '40px', borderRadius: '15px', border: '1px solid #333'}}>
        <h2 style={{color: '#fff', textAlign: 'center'}}>Deploy Video (Max 100MB)</h2>
        <form onSubmit={uploadVideo} style={{display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px'}}>
          <input placeholder="Video Title" onChange={e => setTitle(e.target.value)} style={{padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px'}} />
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{color: '#888'}} />
          
          {status === 'loading' && <p style={{color: 'orange'}}>⏳ Deploying to nodes... please wait.</p>}
          {status === 'error' && <p style={{color: 'red'}}>❌ Failed. Click button to retry immediately.</p>}
          {status === 'success' && <p style={{color: 'green'}}>✅ Success! Rerouting...</p>}

          <button style={{padding: '15px', background: '#06b6d4', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px'}}>
            {status === 'loading' ? 'Uploading...' : 'Deploy Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StreamUpload;