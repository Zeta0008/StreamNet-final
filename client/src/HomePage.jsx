// STREAMNET V2 | Polished Auth Gate Edition
// Author: Ramendra Upadhyay | SRMU MCA
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Core State
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); 
  
  // New Authentication State for Presentation
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Profile Data
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: 'Anti-censorship advocate.',
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://streamnet-final.onrender.com/api/videos');
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Backend Disconnected:", err);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // --- INTERACTION HANDLERS ---
  const handleUploadClick = () => {
    if (!isRegistered) {
      setActiveModal('signup');
    } else {
      navigate('/upload');
    }
  };

  const handleProfileClick = () => {
    if (!isRegistered) {
      setActiveModal('signup');
    } else {
      setActiveModal('profile');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    setActiveModal(null); // Close modal on success
    alert(`Welcome to StreamNet, ${profile.username || 'Creator'}! You can now upload.`);
  };

  return (
    <div style={styles.dashboardContainer}>
      
      {/* --- TOP NAVBAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          {/* FIXED: Removed background-clip, added crisp neon text shadow */}
          <h1 style={styles.logo} onClick={() => window.location.reload()}>StreamNet</h1>
        </div>
        <div style={styles.navCenter}>
          <input type="text" placeholder="Search StreamNet..." style={styles.searchBar} />
        </div>
        <div style={styles.navRight}>
           <div style={styles.userBadge} onClick={handleProfileClick}>
             {isRegistered && profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
           </div>
        </div>
      </nav>

      <div style={styles.mainLayout}>
        
        {/* --- LEFT SIDEBAR --- */}
        <aside style={styles.leftSidebar}>
          <div style={styles.menuList}>
            <button style={styles.uploadBtn} onClick={handleUploadClick}>+ UPLOAD VIDEO</button>
            <button style={styles.menuItemActive} onClick={() => setActiveModal(null)}>HOME</button>
            <button style={styles.menuItem} onClick={handleProfileClick}>MY PROFILE</button>
            <button style={styles.menuItem}>FOLLOWING</button>
            <button style={styles.menuItem}>SAVED</button>
            <button style={styles.menuItem} onClick={() => setActiveModal('about')}>ABOUT</button>
          </div>
        </aside>

        {/* --- MAIN VIDEO GRID --- */}
        <main style={styles.contentArea}>
          <h2 style={styles.sectionTitle}>Recommended For You</h2>
          
          {loading ? (
            <p style={styles.loadingText}>Connecting to StreamNet Nodes...</p>
          ) : (
            <div style={styles.videoGrid}>
              {videos.length === 0 ? <p style={styles.loadingText}>No videos live. Upload something!</p> : null}
              {videos.map((vid, index) => (
                <div key={vid._id || index} style={styles.videoCard}>
                  <video src={vid.videoUrl} controls style={styles.thumbnail} />
                  <div style={styles.cardInfo}>
                    <h4 style={styles.vidTitle}>{vid.title || `StreamNet Feed ${index + 1}`}</h4>
                    <p style={styles.vidStats}>StreamNet Encrypted • Live</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* --- RIGHT SIDEBAR --- */}
        <aside style={styles.rightSidebar}>
          <h3 style={styles.categoryHeader}>CATEGORIES</h3>
          {['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY'].map(cat => (
            <button key={cat} style={styles.categoryItem}>{cat}</button>
          ))}
        </aside>
      </div>

      {/* --- SIGNUP / REGISTER MODAL --- */}
      {activeModal === 'signup' && (
        <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Join StreamNet</h2>
            <p style={{color: '#888', fontSize: '13px', marginBottom: '20px'}}>Create a free identity to upload and interact.</p>
            <form onSubmit={handleRegister} style={styles.profileForm}>
              <input 
                type="text" 
                placeholder="Choose a Username" 
                onChange={(e) => setProfile({...profile, username: e.target.value})}
                style={styles.modalInput} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                style={styles.modalInput} 
                required 
              />
              <button type="submit" style={styles.saveBtn}>Create Account</button>
            </form>
          </div>
        </div>
      )}

      {/* --- PROFILE MODAL (Only visible if registered) --- */}
      {activeModal === 'profile' && isRegistered && (
        <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>My Identity</h2>
            <p style={{color: '#06b6d4', fontWeight: 'bold'}}>@{profile.username}</p>
            <p style={{color: '#ccc', fontSize: '14px'}}>{profile.bio}</p>
            <button style={styles.cancelBtn} onClick={() => setIsRegistered(false)}>Log Out</button>
          </div>
        </div>
      )}

    </div>
  );
};

// --- POLISHED CSS ---
const styles = {
  dashboardContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", overflow: 'hidden' },
  
  // Navbar (Crisp Logo Fix)
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#111', borderBottom: '1px solid #222', zIndex: 10 },
  logo: { margin: 0, fontSize: '26px', fontWeight: '900', color: '#fff', textShadow: '0 0 10px #a855f7, 0 0 20px #06b6d4', cursor: 'pointer', letterSpacing: '1px' },
  navCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  searchBar: { width: '100%', maxWidth: '500px', padding: '12px 20px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', outline: 'none', transition: 'border 0.3s', '&:focus': { border: '1px solid #06b6d4' } },
  navRight: { width: '200px', display: 'flex', justifyContent: 'flex-end' },
  userBadge: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', border: '2px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' },

  mainLayout: { display: 'flex', flex: 1, overflow: 'hidden' },
  
  // Sidebars
  leftSidebar: { width: '240px', background: '#0a0a0a', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '20px 0' },
  rightSidebar: { width: '240px', background: '#0a0a0a', borderLeft: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '20px 0' },
  categoryHeader: { padding: '0 25px', fontSize: '12px', color: '#555', letterSpacing: '2px', marginBottom: '15px' },
  
  // Buttons
  menuList: { display: 'flex', flexDirection: 'column' },
  uploadBtn: { margin: '0 20px 20px 20px', padding: '12px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)' },
  menuItem: { padding: '12px 25px', background: 'transparent', border: 'none', color: '#888', fontWeight: '600', textAlign: 'left', cursor: 'pointer', borderLeft: '3px solid transparent' },
  menuItemActive: { padding: '12px 25px', background: '#111', border: 'none', color: '#fff', fontWeight: '600', textAlign: 'left', cursor: 'pointer', borderLeft: '3px solid #06b6d4' },
  categoryItem: { padding: '10px 25px', background: 'transparent', border: 'none', color: '#777', textAlign: 'left', cursor: 'pointer' },
  
  // Grid
  contentArea: { flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#050505' },
  sectionTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#fff' },
  loadingText: { color: '#666' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  videoCard: { background: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid #222' },
  thumbnail: { width: '100%', height: '160px', backgroundColor: '#1a1a1a', objectFit: 'cover' },
  cardInfo: { padding: '15px' },
  vidTitle: { margin: '0 0 5px 0', fontSize: '14px', color: '#eee' },
  vidStats: { margin: 0, fontSize: '12px', color: '#555' },

  // Modals
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#111', padding: '30px', border: '1px solid #333', borderRadius: '12px', width: '380px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' },
  modalTitle: { marginTop: 0, color: '#fff', marginBottom: '5px' },
  profileForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  modalInput: { padding: '15px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff', outline: 'none' },
  saveBtn: { padding: '15px', background: '#fff', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  cancelBtn: { padding: '12px', background: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '20px' }
};

export default HomePage;