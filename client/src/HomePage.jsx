import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. IDENTITY CHECK (LocalStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('streamnet_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 2. VIDEO FETCH: Connect to your live Render backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('https://streamnet-final.onrender.com/api/videos');
        setVideos(res.data);
      } catch (err) {
        console.error("Connection to Render failed");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const newUser = { name: usernameInput };
    localStorage.setItem('streamnet_user', JSON.stringify(newUser));
    setUser(newUser);
    setActiveModal(null);
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('streamnet_user');
    setUser(null);
    setActiveModal('auth');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo} onClick={() => window.location.reload()}>StreamNet</h1>
        <div style={styles.navActions}>
          <button style={styles.uploadBtn} onClick={() => user ? navigate('/upload') : setActiveModal('auth')}>
            + Upload
          </button>
          <div style={styles.avatar} onClick={() => user ? setActiveModal('settings') : setActiveModal('auth')}>
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.hero}>
          <h2 style={styles.heroTitle}>Welcome to the StreamNet Network</h2>
          <p style={styles.heroSub}>Encrypted Video Infrastructure for SRMU</p>
        </header>

        {/* --- DYNAMIC VIDEO GRID --- */}
        {loading ? (
          <p style={styles.statusText}>Syncing with network nodes...</p>
        ) : (
          <div style={styles.grid}>
            {videos.length === 0 && <p style={styles.statusText}>No videos found. Be the first to deploy.</p>}
            
            {videos.map((vid) => (
              <div key={vid._id} style={styles.videoCard}>
                <video src={vid.videoUrl} controls style={styles.thumbnail} />
                <div style={styles.cardInfo}>
                  <h4 style={styles.vidTitle}>{vid.title}</h4>
                  <p style={styles.vidMeta}>Live • {new Date(vid.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODALS (AUTH & SETTINGS) --- */}
      {activeModal === 'auth' && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Create Identity</h3>
            <form onSubmit={handleSaveProfile} style={styles.form}>
              <input type="text" placeholder="Username" required onChange={e => setUsernameInput(e.target.value)} style={styles.input} />
              <button type="submit" style={styles.primaryBtn}>Save</button>
              <button type="button" onClick={() => setActiveModal(null)} style={styles.secondaryBtn}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'settings' && user && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Identity Active</h3>
            <h1 style={{color: '#06b6d4', margin: '10px 0'}}>@{user.name}</h1>
            <div style={styles.form}>
              <button onClick={handleSwitchAccount} style={styles.outlineBtn}>⇄ Switch / Add Account</button>
              <button onClick={() => setActiveModal(null)} style={styles.primaryBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- RESPONSIVE POLISHED STYLES ---
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: '#0a0a0a', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '1.5rem', fontWeight: '900', textShadow: '0 0 10px #06b6d4', cursor: 'pointer' },
  navActions: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', border: '2px solid #a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' },
  uploadBtn: { padding: '8px 16px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  
  main: { padding: '20px 5%' },
  hero: { textAlign: 'center', padding: '40px 0' },
  heroTitle: { fontSize: '1.8rem', margin: '0 0 10px 0' },
  heroSub: { color: '#666', fontSize: '0.9rem' },
  statusText: { textAlign: 'center', color: '#444', marginTop: '50px' },

  // GRID: Automatically adjusts columns based on screen width (Desktop vs Android)
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  videoCard: { backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' },
  thumbnail: { width: '100%', height: '160px', objectFit: 'cover', backgroundColor: '#000' },
  cardInfo: { padding: '15px' },
  vidTitle: { margin: '0 0 5px 0', fontSize: '1rem', color: '#eee' },
  vidMeta: { margin: 0, fontSize: '0.8rem', color: '#555' },

  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modal: { width: '100%', maxWidth: '350px', backgroundColor: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px' },
  primaryBtn: { padding: '12px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  secondaryBtn: { padding: '12px', backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer' },
  outlineBtn: { padding: '12px', backgroundColor: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
};

export default HomePage;