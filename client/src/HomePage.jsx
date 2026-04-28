import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [nameInput, setNameInput] = useState('');

  // 1. MEMORY: Site checks local storage to see if you exist
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sn_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('https://streamnet-final.onrender.com/api/videos');
        setVideos(res.data);
      } catch (e) { console.log("Connecting to nodes..."); }
    };
    fetch();
  }, []);

  const handleCreateProfile = (e) => {
    e.preventDefault();
    const newUser = { name: nameInput };
    localStorage.setItem('sn_user_profile', JSON.stringify(newUser)); // SAVE PERMANENTLY
    setUser(newUser);
    setActiveModal(null);
  };

  const switchProfile = () => {
    localStorage.removeItem('sn_user_profile'); // WIPE FOR NEW USER
    setUser(null);
    setActiveModal('auth');
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <h1 style={s.logo}>StreamNet</h1>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <button style={s.upBtn} onClick={() => user ? navigate('/upload') : setActiveModal('auth')}>+ Upload</button>
          <div style={s.avatar} onClick={() => user ? setActiveModal('settings') : setActiveModal('auth')}>
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </nav>

      {/* RESPONSIVE GRID: Adapts to Android automatically */}
      <div style={s.grid}>
        {videos.map(v => (
          <div key={v._id} style={s.card}>
            <video src={v.videoUrl} controls style={s.vid} />
            <p style={s.vidTitle}>{v.title}</p>
          </div>
        ))}
      </div>

      {/* AUTH MODAL */}
      {activeModal === 'auth' && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3>Initialize Identity</h3>
            <form onSubmit={handleCreateProfile} style={s.form}>
              <input placeholder="Enter Name" required onChange={e => setNameInput(e.target.value)} style={s.input}/>
              <button style={s.btn}>Save & Enter</button>
            </form>
          </div>
        </div>
      )}

      {/* SETTINGS (YouTube Switch Style) */}
      {activeModal === 'settings' && user && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h1 style={{color: '#06b6d4'}}>@{user.name}</h1>
            <button onClick={switchProfile} style={s.switchBtn}>⇄ Switch / Add Another Profile</button>
            <button onClick={() => setActiveModal(null)} style={s.btn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 5%', background: '#0a0a0a', borderBottom: '1px solid #222' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 0 10px #06b6d4' },
  upBtn: { padding: '8px 16px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#222', border: '2px solid #a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '30px 5%', justifyContent: 'center' },
  card: { width: '300px', flexGrow: 1, maxWidth: '400px', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid #222' },
  vid: { width: '100%', height: '200px', objectFit: 'cover' },
  vidTitle: { padding: '15px', margin: 0, fontSize: '14px' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' },
  modal: { background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center', width: '100%', maxWidth: '350px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px' },
  btn: { padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' },
  switchBtn: { padding: '12px', background: 'transparent', border: '1px solid #06b6d4', color: '#06b6d4', borderRadius: '6px', marginBottom: '10px', width: '100%', cursor: 'pointer' }
};

export default HomePage;