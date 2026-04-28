import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  // 1. Setup State
  const [activeModal, setActiveModal] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  
  // 2. MEMORY CHECK: On page load, see if a profile is saved in localStorage
  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem('streamnet_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // 3. Save Profile Function
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const newProfile = { name: usernameInput };
    localStorage.setItem('streamnet_profile', JSON.stringify(newProfile)); // Save to memory
    setActiveProfile(newProfile); // Update UI
    setActiveModal(null); // Close modal
  };

  // 4. Switch Profile Function (The YouTube feature)
  const handleSwitchProfile = () => {
    localStorage.removeItem('streamnet_profile'); // Wipe memory
    setActiveProfile(null); // Reset UI
    setActiveModal('auth'); // Open create modal
  };

  // 5. Smart Upload Button Logic
  const handleUploadClick = () => {
    if (!activeProfile) {
      setActiveModal('auth'); // Force profile creation first
    } else {
      navigate('/upload'); // Proceed to upload
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Top Navigation */}
      <nav style={styles.nav}>
        <h1 style={{color: '#fff', margin: 0}}>StreamNet</h1>
        <div style={styles.navRight}>
          <button style={styles.uploadBtn} onClick={handleUploadClick}>+ Upload</button>
          
          {/* Profile Icon */}
          <div style={styles.profileCircle} onClick={() => setActiveModal('profileSettings')}>
            {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{padding: '20px', color: '#fff', textAlign: 'center', marginTop: '50px'}}>
        <h2>Welcome to the StreamNet Network</h2>
        <p style={{color: '#888'}}>Video grid will load here...</p>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Create Profile Modal */}
      {activeModal === 'auth' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>Create Network Identity</h3>
            <form onSubmit={handleSaveProfile} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <input 
                type="text" 
                placeholder="Enter Username" 
                required 
                onChange={(e) => setUsernameInput(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.btn}>Save Identity</button>
              <button type="button" onClick={() => setActiveModal(null)} style={styles.btnOutline}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Profile Settings Modal (With Switch Account) */}
      {activeModal === 'profileSettings' && activeProfile && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>Identity Active</h3>
            <h1 style={{color: '#06b6d4', margin: '10px 0'}}>@{activeProfile.name}</h1>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px'}}>
              <button onClick={handleSwitchProfile} style={styles.btnOutline}>
                Switch / Add Another Profile
              </button>
              <button onClick={() => setActiveModal(null)} style={styles.btn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// RESPONSIVE CSS
const styles = {
  page: { minHeight: '100vh', backgroundColor: '#050505', fontFamily: 'sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#111', borderBottom: '1px solid #222' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  profileCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', border: '2px solid #06b6d4', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' },
  uploadBtn: { padding: '8px 16px', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' },
  modalCard: { width: '100%', maxWidth: '350px', backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', color: '#fff', textAlign: 'center' },
  input: { padding: '12px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '6px', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '12px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnOutline: { padding: '12px', backgroundColor: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '6px', cursor: 'pointer' }
};

export default HomePage;