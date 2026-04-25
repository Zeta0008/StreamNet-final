// STREAMNET MASTER UI | Premium Glassmorphism Edition
// Author: Ramendra Upadhyay
// Features: Dynamic Routing, Real Cloudinary Fetching, Interactive Profile Engine.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  // Core State
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'about', etc.
  
  // Profile State
  const [profile, setProfile] = useState({
    username: 'Anonymous User',
    bio: 'Anti-censorship advocate.',
    avatar: null
  });

  // Fetch real videos from your backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Backend Disconnected:", err);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Profile Save Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert(`Profile saved for ${profile.username}!`);
    setActiveModal(null);
  };

  return (
    <div style={styles.dashboardContainer}>
      
      {/* --- TOP NAVBAR (Glassmorphism) --- */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>StreamNet</h1>
        </div>
        <div style={styles.navCenter}>
          <input type="text" placeholder="Search StreamNet..." style={styles.searchBar} />
        </div>
        <div style={styles.navRight}>
           <div style={styles.userBadge} onClick={() => setActiveModal('profile')}>
             {profile.username.charAt(0).toUpperCase()}
           </div>
        </div>
      </nav>

      <div style={styles.mainLayout}>
        
        {/* --- LEFT SIDEBAR --- */}
        <aside style={styles.leftSidebar}>
          <div style={styles.menuList}>
            <button style={styles.menuItemActive} onClick={() => setActiveModal(null)}>HOME</button>
            <button style={styles.menuItem} onClick={() => setActiveModal('profile')}>MY PROFILE</button>
            <button style={styles.menuItem}>FOLLOWING</button>
            <button style={styles.menuItem}>SAVED</button>
            <button style={styles.menuItem}>ARCHIVES PRIVATE</button>
            <button style={styles.menuItem}>NEW</button>
            <button style={styles.menuItem} onClick={() => setActiveModal('about')}>ABOUT</button>
            <button style={styles.menuItem}>SUBSCRIPTION</button>
          </div>
          <div style={styles.supportBox}>
            <p style={styles.supportText}>Support StreamNet</p>
            <p style={styles.supportSubText}>Donate for non-censorship.</p>
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
                    <h4 style={styles.vidTitle}>{vid.title || `StreamNet Encrypted Feed ${index + 1}`}</h4>
                    <p style={styles.vidStats}>14K views • 2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div style={styles.pagination}>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <button key={num} style={num === 1 ? styles.pageBtnActive : styles.pageBtn}>{num}</button>
            ))}
            <button style={styles.pageBtn}>&gt;</button>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR (CATEGORIES) --- */}
        <aside style={styles.rightSidebar}>
          <h3 style={styles.categoryHeader}>CATEGORIES</h3>
          {['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY', 'TECHNOLOGY', 'INDIA CENTRAL', 'WORLD VIEW'].map(cat => (
            <button key={cat} style={styles.categoryItem}>{cat}</button>
          ))}
        </aside>
      </div>

      {/* --- PROFILE MODAL ENGINE --- */}
      {activeModal === 'profile' && (
        <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>My Profile Setup</h2>
            <form onSubmit={handleSaveProfile} style={styles.profileForm}>
              <div style={styles.avatarUploadBox}>
                <label style={styles.avatarLabel}>Upload Profile Picture</label>
                <input type="file" accept="image/*" style={styles.fileInput} />
              </div>
              <input 
                type="text" 
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
                placeholder="Anonymous Username" 
                style={styles.modalInput} 
                required 
              />
              <textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Public Disclaimer / Bio" 
                style={styles.modalTextarea} 
                rows="4"
              />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setActiveModal(null)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ABOUT MODAL --- */}
      {activeModal === 'about' && (
        <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>About StreamNet</h2>
            <p style={{color: '#ccc', lineHeight: '1.6'}}>
              StreamNet is an anti-censorship platform, abiding by national and international laws but securing the privacy of the uploader. A strict non-biased media portal designed for uncompromised truth.
            </p>
            <button style={styles.saveBtn} onClick={() => setActiveModal(null)}>Acknowledge</button>
          </div>
        </div>
      )}

    </div>
  );
};

// --- PREMIUM FUTURISTIC CSS ---
const styles = {
  dashboardContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#050505', backgroundImage: 'radial-gradient(circle at 50% 0%, #1a0b2e 0%, #050505 50%)', color: '#fff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", overflow: 'hidden' },
  
  // Navbar (Glassmorphism)
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', zIndex: 10 },
  logo: { margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', letterSpacing: '1px' },
  navCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  searchBar: { width: '100%', maxWidth: '600px', padding: '12px 25px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', outline: 'none', transition: 'border 0.3s', '&:focus': { border: '1px solid #06b6d4' } },
  navRight: { width: '250px', display: 'flex', justifyContent: 'flex-end' },
  userBadge: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #a855f7, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 15px rgba(168,85,247,0.4)' },

  mainLayout: { display: 'flex', flex: 1, overflow: 'hidden' },
  
  // Sidebars
  leftSidebar: { width: '260px', background: 'rgba(5,5,5,0.8)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 0', overflowY: 'auto' },
  rightSidebar: { width: '260px', background: 'rgba(5,5,5,0.8)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  categoryHeader: { padding: '0 25px', fontSize: '12px', color: '#666', letterSpacing: '2px', marginBottom: '10px' },
  
  // Menu Items
  menuList: { display: 'flex', flexDirection: 'column' },
  menuItem: { padding: '15px 25px', background: 'transparent', border: 'none', color: '#aaa', fontWeight: '600', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', borderLeft: '3px solid transparent' },
  menuItemActive: { padding: '15px 25px', background: 'rgba(168, 85, 247, 0.1)', border: 'none', color: '#fff', fontWeight: '600', textAlign: 'left', cursor: 'pointer', borderLeft: '3px solid #a855f7' },
  categoryItem: { padding: '12px 25px', background: 'transparent', border: 'none', color: '#888', textAlign: 'left', cursor: 'pointer', transition: 'color 0.2s', fontWeight: '500' },
  
  supportBox: { margin: '20px', padding: '20px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', cursor: 'pointer' },
  supportText: { margin: 0, fontWeight: 'bold', color: '#06b6d4' },
  supportSubText: { fontSize: '11px', margin: '5px 0 0 0', color: '#888' },

  // Main Content & Grid
  contentArea: { flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  sectionTitle: { margin: '0 0 20px 0', fontSize: '20px', color: '#fff' },
  loadingText: { color: '#888', textAlign: 'center', marginTop: '50px' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', flex: 1 },
  videoCard: { background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  thumbnail: { width: '100%', height: '180px', backgroundColor: '#000', objectFit: 'cover' },
  cardInfo: { padding: '15px' },
  vidTitle: { margin: '0 0 8px 0', fontSize: '15px', color: '#eee', lineHeight: '1.4' },
  vidStats: { margin: 0, fontSize: '12px', color: '#666' },

  // Pagination
  pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  pageBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#888', cursor: 'pointer' },
  pageBtnActive: { padding: '8px 16px', background: '#a855f7', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },

  // Modals
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#111', padding: '30px', border: '1px solid rgba(168,85,247,0.5)', borderRadius: '16px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  modalTitle: { marginTop: 0, color: '#fff', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' },
  profileForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  avatarUploadBox: { padding: '20px', border: '2px dashed rgba(168,85,247,0.3)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: 'rgba(168,85,247,0.05)' },
  avatarLabel: { display: 'block', color: '#a855f7', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' },
  fileInput: { width: '100%', color: '#888', fontSize: '12px' },
  modalInput: { padding: '12px 15px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' },
  modalTextarea: { padding: '12px 15px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '10px' },
  cancelBtn: { flex: 1, padding: '12px', background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: '12px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }
};

export default HomePage;