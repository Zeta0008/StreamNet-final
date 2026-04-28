import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StreamUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('NEW');
  const [status, setStatus] = useState('idle');
  
  // Grab the user so we can attach their name to the video
  const user = JSON.parse(localStorage.getItem('streamnet_master_user')) || { name: 'Anonymous' };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Title & File required.");
    setStatus('loading');

    const fd = new FormData();
    fd.append('video', file);
    fd.append('title', title);
    fd.append('category', category); // Sending category to backend
    fd.append('uploader', user.name); // Sending username to backend

    try {
      await axios.post('https://streamnet-final.onrender.com/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000 
      });
      setStatus('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const categories = ['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY', 'TECHNOLOGY', 'INDIA CENTRAL', 'WORLD VIEW'];

  return (
    <div style={{minHeight: '100vh', background: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: "'Inter', sans-serif"}}>
      <div style={{width: '100%', maxWidth: '450px', background: '#111', padding: '40px', borderRadius: '15px', border: '1px solid #a855f7', boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)', textAlign: 'center'}}>
        <h2 style={{color: '#fff', textShadow: '0 0 10px #06b6d4'}}>Deploy Node Video</h2>
        <p style={{color: '#06b6d4', fontSize: '12px', marginBottom: '30px'}}>Uploading as: @{user.name}</p>
        
        <form onSubmit={handleUpload} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <input placeholder="Video Title" onChange={e => setTitle(e.target.value)} style={{padding: '15px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none'}} />
          
          <select onChange={e => setCategory(e.target.value)} style={{padding: '15px', background: '#1a1a1a', border: '1px solid #333', color: '#06b6d4', borderRadius: '8px', outline: 'none', cursor: 'pointer'}}>
            <option value="NEW">Select a Category...</option>
            {categories.map(cat => <option key={cat} value={cat}>#{cat}</option>)}
          </select>

          <div style={{border: '1px dashed #a855f7', padding: '20px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.05)'}}>
             <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{color: '#888', cursor: 'pointer', width: '100%'}} />
          </div>
          
          {status === 'loading' && <p style={{color: 'orange'}}>⏳ Encrypting & Transferring to Cloudinary...</p>}
          {status === 'error' && <p style={{color: '#ff3333'}}>❌ Failed. Wait 20s and Retry.</p>}
          {status === 'success' && <p style={{color: '#32ff64'}}>✅ Success! Rerouting...</p>}

          <button style={{padding: '15px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'}}>
            {status === 'loading' ? 'Processing...' : 'Deploy Now'}
          </button>
          <button type="button" onClick={() => navigate('/')} style={{background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', marginTop: '10px'}}>Return Home</button>
        </form>
      </div>
    </div>
  );
};

export default StreamUpload;