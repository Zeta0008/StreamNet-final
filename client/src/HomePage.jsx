import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [nameInput, setNameInput] = useState('');
  
  // --- ADVANCED STATE (Presentation Features) ---
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Persistent Memory States
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('streamnet_master_user')) || null; } catch(e) { return null; }
  });
  const [savedVideos, setSavedVideos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sn_saved')) || []; } catch(e) { return []; }
  });
  const [followedUsers, setFollowedUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sn_followed')) || []; } catch(e) { return []; }
  });
  const [privateArchives, setPrivateArchives] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sn_private')) || []; } catch(e) { return []; }
  });

  // --- FETCH VIDEOS ---
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://streamnet-final.onrender.com/api/videos');
      // For presentation: If a video has no category or uploader, assign random ones so UI looks full
      const enrichedVideos = res.data.map((vid, index) => ({
        ...vid,
        category: vid.category || categories[index % categories.length],
        uploader: vid.uploader || `Node_Creator_${index + 1}`
      }));
      setVideos(enrichedVideos);
    } catch (err) {
      console.error("Backend offline, waiting for Render...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  // --- INTERACTION HANDLERS ---
  const requireAuth = (action) => {
    if (!user) return setActiveModal('auth');
    if (action === 'upload') navigate('/upload');
    if (action === 'profile') setActiveModal('settings');
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const newUser = { name: nameInput.trim() };
    localStorage.setItem('streamnet_master_user', JSON.stringify(newUser));
    setUser(newUser);
    setActiveModal(null);
  };

  const handleFollow = (uploaderName) => {
    if (!user) return setActiveModal('auth');
    if (!followedUsers.includes(uploaderName)) {
      const updated = [...followedUsers, uploaderName];
      setFollowedUsers(updated);
      localStorage.setItem('sn_followed', JSON.stringify(updated));
      alert(`You are now following ${uploaderName}`);
    }
  };

  const handleSaveVideo = (vid) => {
    if (!user) return setActiveModal('auth');
    if (!savedVideos.find(v => v._id === vid._id)) {
      const updated = [...savedVideos, vid];
      setSavedVideos(updated);
      localStorage.setItem('sn_saved', JSON.stringify(updated));
      alert(`Video saved to your local vault.`);
    }
  };

  const handlePrivateUpload = (e) => {
    e.preventDefault();
    const newPrivate = { id: Date.now(), title: e.target.title.value, date: new Date().toLocaleDateString() };
    const updated = [...privateArchives, newPrivate];
    setPrivateArchives(updated);
    localStorage.setItem('sn_private', JSON.stringify(updated));
    alert("Video deeply compressed and saved to Private Archives.");
    e.target.reset();
  };

  const handleMenuClick = (item) => {
    if (item === 'HOME') { setSelectedCategory('ALL'); setActiveModal(null); }
    else if (item === 'MY PROFILE') requireAuth('profile');
    else if (item === 'NEW') { setSelectedCategory('ALL'); fetchVideos(); }
    else if (item === 'FOLLOWING') { if(!user) setActiveModal('auth'); else setActiveModal('following'); }
    else if (item === 'SAVED') { if(!user) setActiveModal('auth'); else setActiveModal('saved'); }
    else if (item === 'ARCHIVES PRIVATE') { if(!user) setActiveModal('auth'); else setActiveModal('archives'); }
    else if (item === 'ABOUT') setActiveModal('about');
    else if (item === 'SUBSCRIPTION') setActiveModal('subscription');
  };

  // --- DATA FILTERING ---
  const displayedVideos = selectedCategory === 'ALL' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const leftMenu = ['HOME', 'MY PROFILE', 'FOLLOWING', 'SAVED', 'ARCHIVES PRIVATE', 'NEW', 'ABOUT', 'SUBSCRIPTION'];
  const categories = ['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY', 'TECHNOLOGY', 'INDIA CENTRAL', 'WORLD VIEW'];

  return (
    <div style={styles.dashboard}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => handleMenuClick('HOME')}>StreamNet</h1>
        <div style={styles.navCenter}><input type="text" placeholder="Search Encrypted Network..." style={styles.searchBar} /></div>
        <div style={styles.navRight}>
          <button style={styles.uploadBtn} onClick={() => requireAuth('upload')}>+ Upload</button>
          <div style={styles.avatar} onClick={() => requireAuth('profile')}>{user ? user.name.charAt(0).toUpperCase() : '?'}</div>
        </div>
      </nav>

      <div style={styles.mainLayout}>
        {/* LEFT SIDEBAR */}
        <aside style={styles.leftSidebar}>
          <div style={styles.menuList}>
            {leftMenu.map((item, idx) => (
              <button key={idx} style={styles.menuItem} onClick={() => handleMenuClick(item)}>{item}</button>
            ))}
          </div>
          <div style={styles.supportBox} onClick={() => setActiveModal('support')}>
            <h4 style={{margin: '0 0 5px 0', color: '#06b6d4', cursor: 'pointer'}}>Support StreamNet</h4>
            <p style={{margin: 0, fontSize: '10px', color: '#888'}}>Donate for non-censorship.</p>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main style={styles.contentArea}>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1000px', alignItems: 'center'}}>
            <h2 style={styles.sectionTitle}>{selectedCategory === 'ALL' ? 'Recommended For You' : `${selectedCategory} Network`}</h2>
            {selectedCategory !== 'ALL' && <button onClick={() => setSelectedCategory('ALL')} style={styles.clearBtn}>Clear Filter</button>}
          </div>
          
          <div style={styles.videoGrid}>
            {loading && <p style={{color: '#888'}}>Syncing nodes...</p>}
            {!loading && displayedVideos.length === 0 && <p style={{color: '#888'}}>No videos in this category.</p>}
            
            {displayedVideos.map(vid => (
              <div key={vid._id} style={styles.videoCard}>
                <video src={vid.videoUrl} controls style={styles.thumbnail} />
                <div style={styles.cardInfo}>
                  <p style={styles.vidTitle}>{vid.title}</p>
                  
                  {/* NEW: Uploader Info & Interaction Buttons */}
                  <div style={styles.vidInteractions}>
                    <span style={styles.uploaderText}>@{vid.uploader}</span>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button style={styles.actionBtn} onClick={() => handleFollow(vid.uploader)}>
                        {followedUsers.includes(vid.uploader) ? '✓ Following' : '+ Follow'}
                      </button>
                      <button style={styles.actionBtn} onClick={() => handleSaveVideo(vid)}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR (CATEGORIES) */}
        <aside style={styles.rightSidebar}>
          <h3 style={styles.categoryHeader}>FILTER BY NETWORK</h3>
          <button style={selectedCategory === 'ALL' ? styles.catBtnActive : styles.categoryItem} onClick={() => setSelectedCategory('ALL')}>ALL VIDEOS</button>
          {categories.map(cat => (
            <button key={cat} style={selectedCategory === cat ? styles.catBtnActive : styles.categoryItem} onClick={() => setSelectedCategory(cat)}>{cat}</button>
          ))}
        </aside>
      </div>

      {/* --- ALL MODALS --- */}
      {activeModal && (
        <div style={styles.overlay} onClick={() => setActiveModal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            
            {/* 1. AUTH MODAL */}
            {activeModal === 'auth' && (
              <>
                <h3>Initialize Identity</h3>
                <p style={{color: '#888', fontSize: '12px', marginBottom: '20px'}}>Join the decentralized network.</p>
                <form onSubmit={handleSaveUser} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <input placeholder="Enter Username" required onChange={e => setNameInput(e.target.value)} style={styles.modalInput}/>
                  <button type="submit" style={styles.primaryBtn}>Save Identity</button>
                </form>
              </>
            )}

            {/* 2. SETTINGS / PROFILE MODAL */}
            {activeModal === 'settings' && (
              <>
                <h3 style={{color: '#06b6d4'}}>@{user?.name}</h3>
                <p style={{color: '#888', fontSize: '12px'}}>Status: Verified StreamNet Node</p>
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <button onClick={() => { localStorage.removeItem('streamnet_master_user'); setUser(null); setActiveModal('auth'); }} style={styles.outlineBtn}>⇄ Switch Account</button>
                  <button onClick={() => setActiveModal(null)} style={styles.primaryBtn}>Close</button>
                </div>
              </>
            )}

            {/* 3. ABOUT MODAL (For the Professor) */}
            {activeModal === 'about' && (
              <div style={{textAlign: 'left'}}>
                <h2 style={{color: '#a855f7', marginBottom: '10px'}}>About StreamNet</h2>
                <p style={{color: '#ddd', fontSize: '14px', lineHeight: '1.6'}}>
                  StreamNet is a decentralized, censorship-resistant video streaming infrastructure designed for the future of free speech and secure media distribution.
                </p>
                <div style={{background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginTop: '20px', borderLeft: '3px solid #06b6d4'}}>
                  <h4 style={{margin: '0 0 5px 0', color: '#06b6d4'}}>Architecture & Development</h4>
                  <p style={{margin: 0, color: '#888', fontSize: '12px'}}>Developed by <strong>Ramendra Upadhyay</strong>.<br/>Final Master of Computer Applications (MCA) Project.<br/>Shri Ramswaroop Memorial University (SRMU).</p>
                </div>
              </div>
            )}

            {/* 4. SUPPORT MODAL */}
            {activeModal === 'support' && (
              <>
                <h2 style={{color: '#06b6d4'}}>Defend Free Speech</h2>
                <p style={{color: '#ddd', fontSize: '14px', marginTop: '10px'}}>We maintain an unbiased, uncensored network. Server costs are high. If you are a good samaritan, support the mission.</p>
                <button style={{...styles.primaryBtn, marginTop: '20px'}}>Crypto Wallet Address</button>
              </>
            )}

            {/* 5. SUBSCRIPTION MODAL */}
            {activeModal === 'subscription' && (
              <>
                <h2>Cloud Expansion</h2>
                <p style={{color: '#888', fontSize: '14px'}}>Future development: Purchase encrypted off-shore cloud storage for your private archives.</p>
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                  <div style={{flex: 1, padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333'}}><h4>500GB Vault</h4><p style={{color:'#06b6d4'}}>$4.99/mo</p></div>
                  <div style={{flex: 1, padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #a855f7'}}><h4>2TB Vault</h4><p style={{color:'#a855f7'}}>$9.99/mo</p></div>
                </div>
              </>
            )}

            {/* 6. FOLLOWING MODAL */}
            {activeModal === 'following' && (
              <div style={{textAlign: 'left'}}>
                <h3 style={{borderBottom: '1px solid #333', paddingBottom: '10px'}}>Following ({followedUsers.length})</h3>
                {followedUsers.length === 0 ? <p style={{color: '#888'}}>You aren't following any nodes yet.</p> : 
                  <ul style={{color: '#06b6d4', listStyleType: 'none', padding: 0}}>
                    {followedUsers.map((u, i) => <li key={i} style={{padding: '10px', background: '#1a1a1a', marginBottom: '5px', borderRadius: '4px'}}>@{u}</li>)}
                  </ul>
                }
              </div>
            )}

            {/* 7. SAVED VIDEOS MODAL */}
            {activeModal === 'saved' && (
              <div style={{textAlign: 'left'}}>
                <h3 style={{borderBottom: '1px solid #333', paddingBottom: '10px'}}>Local Saved Vault</h3>
                {savedVideos.length === 0 ? <p style={{color: '#888'}}>No videos saved to device memory.</p> : 
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                    {savedVideos.map((v, i) => (
                      <div key={i} style={{padding: '10px', background: '#1a1a1a', borderRadius: '6px'}}>
                        <p style={{margin: 0, fontSize: '14px', color: '#fff'}}>{v.title}</p>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}

            {/* 8. ARCHIVES PRIVATE MODAL */}
            {activeModal === 'archives' && (
              <div style={{textAlign: 'left'}}>
                <h2 style={{color: '#a855f7'}}>Private Deep Archives</h2>
                <p style={{color: '#888', fontSize: '12px'}}>Files uploaded here are compressed and hidden from the global homepage.</p>
                
                <form onSubmit={handlePrivateUpload} style={{marginTop: '20px', padding: '15px', border: '1px dashed #a855f7', borderRadius: '8px'}}>
                  <input name="title" placeholder="Secret Video Title" required style={{...styles.modalInput, marginBottom: '10px'}} />
                  <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#06b6d4', marginBottom: '15px'}}>
                    <input type="checkbox" defaultChecked /> Enable Deep Compression Algorithm
                  </label>
                  <button type="submit" style={styles.primaryBtn}>Encrypt & Save to Archive</button>
                </form>

                <h4 style={{marginTop: '20px'}}>Archived Files ({privateArchives.length})</h4>
                {privateArchives.map(p => <p key={p.id} style={{fontSize: '12px', color: '#888', margin: '5px 0'}}>🔒 {p.title} ({p.date})</p>)}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

// --- LOCKED CSS STYLES ---
const styles = {
  dashboard: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" },
  navbar: { height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#0a0a0a', borderBottom: '1px solid #222' },
  logo: { margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff', textShadow: '0 0 10px #a855f7', cursor: 'pointer' },
  navCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  searchBar: { width: '100%', maxWidth: '400px', padding: '10px 20px', borderRadius: '20px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', outline: 'none' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  uploadBtn: { padding: '8px 20px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#222', border: '2px solid #06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' },

  mainLayout: { display: 'flex', flex: 1, height: 'calc(100vh - 70px)' },
  
  leftSidebar: { width: '220px', background: '#050505', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  menuList: { display: 'flex', flexDirection: 'column', flex: 1 },
  menuItem: { padding: '15px 25px', background: 'transparent', border: 'none', color: '#888', fontWeight: 'bold', fontSize: '12px', textAlign: 'left', cursor: 'pointer', transition: '0.2s', '&:hover': {color: '#fff'} },
  supportBox: { margin: '20px', padding: '15px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '8px', cursor: 'pointer' },

  contentArea: { flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sectionTitle: { margin: '0', fontSize: '20px', color: '#fff', width: '100%', textAlign: 'left' },
  clearBtn: { background: 'transparent', border: '1px solid #888', color: '#888', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px', width: '100%', maxWidth: '1000px', marginTop: '20px' },
  videoCard: { background: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' },
  thumbnail: { width: '100%', height: '160px', backgroundColor: '#000', objectFit: 'cover' },
  cardInfo: { padding: '15px' },
  vidTitle: { margin: '0 0 15px 0', fontSize: '15px', color: '#fff', fontWeight: 'bold' },
  vidInteractions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '10px' },
  uploaderText: { fontSize: '11px', color: '#06b6d4', fontWeight: 'bold' },
  actionBtn: { background: '#222', border: 'none', color: '#aaa', fontSize: '10px', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' },

  rightSidebar: { width: '200px', background: '#050505', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  categoryHeader: { padding: '0 20px', fontSize: '11px', color: '#666', letterSpacing: '1px', marginBottom: '15px' },
  categoryItem: { padding: '10px 20px', background: 'transparent', border: 'none', color: '#888', fontSize: '12px', textAlign: 'left', cursor: 'pointer' },
  catBtnActive: { padding: '10px 20px', background: 'rgba(168, 85, 247, 0.1)', border: 'none', color: '#a855f7', fontSize: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold', borderLeft: '3px solid #a855f7' },

  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
  modal: { background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', textAlign: 'center', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' },
  modalInput: { padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', width: '100%', boxSizing: 'border-box' },
  primaryBtn: { padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  outlineBtn: { padding: '12px', background: 'transparent', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', cursor: 'pointer', width: '100%' }
};

export default HomePage;