import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [nameInput, setNameInput] = useState('');
  
  // PROFILE MEMORY: Check local storage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('streamnet_master_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  // FETCH VIDEOS
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('https://streamnet-final.onrender.com/api/videos');
        setVideos(res.data);
      } catch (err) {
        console.error("Backend offline, waiting for Render...");
      }
    };
    fetchVideos();
  }, []);

  // AUTH LOGIC
  const requireAuth = (action) => {
    if (!user) {
      setActiveModal('auth');
    } else {
      if (action === 'upload') navigate('/upload');
      if (action === 'profile') setActiveModal('settings');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const newUser = { name: nameInput.trim() };
    localStorage.setItem('streamnet_master_user', JSON.stringify(newUser));
    setUser(newUser);
    setActiveModal(null);
  };

  const switchAccount = () => {
    localStorage.removeItem('streamnet_master_user');
    setUser(null);
    setActiveModal('auth');
  };

  const leftMenu = ['HOME', 'MY PROFILE', 'FOLLOWING', 'SAVED', 'ARCHIVES PRIVATE', 'NEW', 'ABOUT', 'SUBSCRIPTION'];
  const categories = ['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY', 'TECHNOLOGY', 'INDIA CENTRAL', 'WORLD VIEW'];

  return (
    <div style={styles.dashboard}>
      {/* --- TOP NAVBAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>StreamNet</h1>
        </div>
        
        <div style={styles.navCenter}>
          <input type="text" placeholder="Search StreamNet..." style={styles.searchBar} />
        </div>

        <div style={styles.navRight}>
          <button style={styles.uploadBtn} onClick={() => requireAuth('upload')}>+ Upload</button>
          <div style={styles.avatar} onClick={() => requireAuth('profile')}>
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </nav>

      {/* --- INDESTRUCTIBLE 3-COLUMN LAYOUT --- */}
      <div style={styles.mainLayout}>
        
        {/* LEFT SIDEBAR */}
        <aside style={styles.leftSidebar}>
          <div style={styles.menuList}>
            {leftMenu.map((item, idx) => (
              <button 
                key={idx} 
                style={item === 'HOME' ? styles.menuItemActive : styles.menuItem}
                onClick={() => item === 'MY PROFILE' ? requireAuth('profile') : null}
              >
                {item}
              </button>
            ))}
          </div>
          <div style={styles.supportBox}>
            <h4 style={{margin: '0 0 5px 0', color: '#06b6d4'}}>Support StreamNet</h4>
            <p style={{margin: 0, fontSize: '10px', color: '#888'}}>Donate for non-censorship.</p>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main style={styles.contentArea}>
          <h2 style={styles.sectionTitle}>Recommended For You</h2>
          
          <div style={styles.videoGrid}>
            {videos.length === 0 && (
              <p style={{color: '#888', gridColumn: '1 / -1', textAlign: 'center'}}>
                Network nodes booting up or no videos deployed.
              </p>
            )}
            {videos.map(vid => (
              <div key={vid._id} style={styles.videoCard}>
                <video src={vid.videoUrl} controls style={styles.thumbnail} />
                <div style={styles.cardInfo}>
                  <p style={styles.vidTitle}>{vid.title}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* PAGINATION */}
          <div style={styles.pagination}>
            <span style={styles.pageActive}>1</span>
            <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>&gt;</span>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={styles.rightSidebar}>
          <h3 style={styles.categoryHeader}>CATEGORIES</h3>
          {categories.map(cat => (
            <button key={cat} style={styles.categoryItem}>{cat}</button>
          ))}
        </aside>

      </div>

      {/* --- MODALS --- */}
      {activeModal === 'auth' && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{color: '#fff', marginBottom: '5px'}}>Initialize Identity</h3>
            <p style={{color: '#888', fontSize: '12px', marginBottom: '20px'}}>Create a local profile to upload videos.</p>
            <form onSubmit={handleSaveProfile} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <input placeholder="Enter Username" required onChange={e => setNameInput(e.target.value)} style={styles.modalInput}/>
              <button type="submit" style={styles.primaryBtn}>Save Identity</button>
              <button type="button" onClick={() => setActiveModal(null)} style={styles.secondaryBtn}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'settings' && user && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{color: '#fff', marginBottom: '5px'}}>Identity Active</h3>
            <h1 style={{color: '#a855f7', margin: '10px 0'}}>@{user.name}</h1>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px'}}>
              <button onClick={switchAccount} style={styles.outlineBtn}>⇄ Switch / Add Account</button>
              <button onClick={() => setActiveModal(null)} style={styles.primaryBtn}>Close Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LOCKED CSS STYLES ---
const styles = {
  dashboard: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" },
  
  navbar: { height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#0a0a0a', borderBottom: '1px solid #222', zIndex: 10 },
  logo: { margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff', textShadow: '0 0 10px #a855f7', cursor: 'pointer' },
  navLeft: { width: '220px' },
  navCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  searchBar: { width: '100%', maxWidth: '400px', padding: '10px 20px', borderRadius: '20px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', outline: 'none' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px', width: '200px', justifyContent: 'flex-end' },
  uploadBtn: { padding: '8px 20px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#222', border: '2px solid #06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' },

  mainLayout: { display: 'flex', flex: 1, height: 'calc(100vh - 70px)' }, // Forces columns to stay visible
  
  leftSidebar: { width: '220px', background: '#050505', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  menuList: { display: 'flex', flexDirection: 'column', flex: 1 },
  menuItem: { padding: '15px 25px', background: 'transparent', border: 'none', color: '#888', fontWeight: 'bold', fontSize: '12px', textAlign: 'left', cursor: 'pointer' },
  menuItemActive: { padding: '15px 25px', background: '#111', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '12px', textAlign: 'left', cursor: 'pointer', borderLeft: '3px solid #a855f7' },
  supportBox: { margin: '20px', padding: '15px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '8px' },

  contentArea: { flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sectionTitle: { margin: '0 0 30px 0', fontSize: '18px', color: '#fff', width: '100%', textAlign: 'left', maxWidth: '1000px' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', width: '100%', maxWidth: '1000px' },
  videoCard: { background: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' },
  thumbnail: { width: '100%', height: '150px', backgroundColor: '#000', objectFit: 'cover' },
  cardInfo: { padding: '15px' },
  vidTitle: { margin: 0, fontSize: '14px', color: '#eee' },
  
  pagination: { display: 'flex', gap: '15px', marginTop: '40px', color: '#888', fontSize: '14px', alignItems: 'center', cursor: 'pointer' },
  pageActive: { background: '#a855f7', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' },

  rightSidebar: { width: '200px', background: '#050505', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  categoryHeader: { padding: '0 20px', fontSize: '11px', color: '#666', letterSpacing: '1px', marginBottom: '15px' },
  categoryItem: { padding: '10px 20px', background: 'transparent', border: 'none', color: '#888', fontSize: '12px', textAlign: 'left', cursor: 'pointer' },

  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modal: { background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', textAlign: 'center', width: '100%', maxWidth: '350px' },
  modalInput: { padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', width: '100%', boxSizing: 'border-box' },
  primaryBtn: { padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  secondaryBtn: { padding: '12px', background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', width: '100%' },
  outlineBtn: { padding: '12px', background: 'transparent', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', cursor: 'pointer', width: '100%' }
};

export default HomePage;