import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [nameInput, setNameInput] = useState('');

  // 1. BROWSER MEMORY: Site remembers who you are on refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sn_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('https://streamnet-final.onrender.com/api/videos');
        setVideos(res.data);
      } catch (e) { console.error("Waking up server..."); }
    };
    fetch();
  }, []);

  const saveUser = (e) => {
    e.preventDefault();
    const newUser = { name: nameInput };
    localStorage.setItem('sn_user', JSON.stringify(newUser)); // Permanent save
    setUser(newUser);
    setActiveModal(null);
  };

  const switchAccount = () => {
    localStorage.removeItem('sn_user'); // Wipe memory
    setUser(null);
    setActiveModal('auth'); // YouTube style: force new creation
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

      {/* DYNAMIC GRID: Adapts to Android automatically */}
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
            <h3 style={{color:'#fff'}}>Create Network Identity</h3>
            <form onSubmit={saveUser} style={s.form}>
              <input placeholder="Username" required onChange={e => setNameInput(e.target.value)} style={s.input}/>
              <button style={s.btn}>Save</button>
            </form>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL: The Switch Profile feature */}
      {activeModal === 'settings' && user && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h1 style={{color: '#06b6d4'}}>@{user.name}</h1>
            <button onClick={switchAccount} style={s.switchBtn}>⇄ Add/Switch Another Profile</button>
            <button onClick={() => setActiveModal(null)} style={s.btn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 5%', background: '#0a0a0a', borderBottom: '1px solid #222' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 0 10px #06b6d4' },
  upBtn: { padding: '8px 16px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 'bold' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#222', border: '2px solid #a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '30px 5%', justifyContent: 'center' },
  card: { width: '300px', flexGrow: 1, backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid #222' },
  vid: { width: '100%', height: '180px', objectFit: 'cover' },
  vidTitle: { padding: '10px', margin: 0 },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modal: { background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center', width: '300px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px' },
  btn: { padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px' },
  switchBtn: { padding: '12px', background: 'transparent', border: '1px solid #06b6d4', color: '#06b6d4', borderRadius: '6px', marginBottom: '10px', width: '100%' }
};

export default HomePage;