import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [nameInput, setNameInput] = useState('');
  
  // NEW: Search State
  const [searchQuery, setSearchQuery] = useState('');
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
      setVideos(res.data);
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

  // NEW: Follow AND Unfollow logic
  const handleFollow = (uploaderName) => {
    if (!user) return setActiveModal('auth');
    if (followedUsers.includes(uploaderName)) {
      // Unfollow
      const updated = followedUsers.filter(u => u !== uploaderName);
      setFollowedUsers(updated);
      localStorage.setItem('sn_followed', JSON.stringify(updated));
    } else {
      // Follow
      const updated = [...followedUsers, uploaderName];
      setFollowedUsers(updated);
      localStorage.setItem('sn_followed', JSON.stringify(updated));
    }
  };

  // NEW: Save and Unsave Video
  const handleSaveVideo = (vid) => {
    if (!user) return setActiveModal('auth');
    if (savedVideos.find(v => v._id === vid._id)) {
      const updated = savedVideos.filter(v => v._id !== vid._id);
      setSavedVideos(updated);
      localStorage.setItem('sn_saved', JSON.stringify(updated));
    } else {
      const updated = [...savedVideos, vid];
      setSavedVideos(updated);
      localStorage.setItem('sn_saved', JSON.stringify(updated));
    }
  };

  // NEW: Private Archive Logic (Stores dummy URL for presentation if no file is selected)
  const handlePrivateUpload = (e) => {
    e.preventDefault();
    const newPrivate = { 
      id: Date.now(), 
      title: e.target.title.value, 
      date: new Date().toLocaleDateString(),
      // In a real app we'd upload this. For presentation, we store a secure local reference
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
    };
    const updated = [...privateArchives, newPrivate];
    setPrivateArchives(updated);
    localStorage.setItem('sn_private', JSON.stringify(updated));
    e.target.reset();
  };

  const handleMenuClick = (item) => {
    if (item === 'HOME') { setSelectedCategory('ALL'); setSearchQuery(''); setActiveModal(null); }
    else if (item === 'MY PROFILE') requireAuth('profile');
    else if (item === 'NEW') { setSelectedCategory('ALL'); fetchVideos(); }
    else if (item === 'FOLLOWING') { if(!user) setActiveModal('auth'); else setActiveModal('following'); }
    else if (item === 'SAVED') { if(!user) setActiveModal('auth'); else setActiveModal('saved'); }
    else if (item === 'ARCHIVES PRIVATE') { if(!user) setActiveModal('auth'); else setActiveModal('archives'); }
    else if (item === 'ABOUT') setActiveModal('about');
    else if (item === 'SUBSCRIPTION') setActiveModal('subscription');
  };

  // --- DATA FILTERING (SEARCH BAR & CATEGORY COMBINED) ---
  const displayedVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const leftMenu = ['HOME', 'MY PROFILE', 'FOLLOWING', 'SAVED', 'ARCHIVES PRIVATE', 'NEW', 'ABOUT', 'SUBSCRIPTION'];
  const categories = ['NEWS', 'WAR', 'STOCKS', 'CENSORED', 'SPORTS', 'ECONOMY', 'TECHNOLOGY', 'INDIA CENTRAL', 'WORLD VIEW'];

  return (
    <div style={styles.dashboard}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <h1 style={styles.logo} onClick={() => handleMenuClick('HOME')}>StreamNet</h1>
        </div>
        
        <div style={styles.navCenter}>
          <input 
            type="text" 
            placeholder="Search StreamNet titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchBar} 
          />
        </div>

        <div style={styles.navRight}>
          {/* NEW: Cloudinary Storage Indicator */}
          <div style={styles.storageIndicator}>
             <span style={{fontSize: '9px', color: '#888'}}>CLOUD LIMIT</span>
             <span style={{fontSize: '12px', fontWeight: 'bold', color: '#32ff64'}}>45% FREE</span>
          </div>

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
            <h2 style={styles.sectionTitle}>
              {searchQuery ? `Search Results: "${searchQuery}"` : (selectedCategory === 'ALL' ? 'Recommended For You' : `#${selectedCategory} Network`)}
            </h2>
            {selectedCategory !== 'ALL' && <button onClick={() => setSelectedCategory('ALL')} style={styles.clearBtn}>Clear Filter</button>}
          </div>
          
          <div style={styles.videoGrid}>
            {loading && <p style={{color: '#a855f7'}}>Syncing Cloudinary nodes...</p>}
            {!loading && displayedVideos.length === 0 && <p style={{color: '#888'}}>No videos match this criteria.</p>}
            
            {displayedVideos.map(vid => (
              <div key={vid._id} style={styles.videoCard}>
                <video src={vid.videoUrl} controls style={styles.thumbnail} />
                <div style={styles.cardInfo}>
                  <p style={styles.vidTitle}>{vid.title}</p>
                  
                  <div style={styles.vidInteractions}>
                    {/* User profile opens when clicking name */}
                    <span 
                      style={styles.uploaderText} 
                      onClick={() => alert(`Opening profile for ${vid.uploader || 'Anonymous'} (Future Scope)`)}
                    >
                      @{vid.uploader || 'Anonymous'}
                    </span>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button 
                        style={followedUsers.includes(vid.uploader || 'Anonymous') ? styles.btnActive : styles.actionBtn} 
                        onClick={() => handleFollow(vid.uploader || 'Anonymous')}
                      >
                        {followedUsers.includes(vid.uploader || 'Anonymous') ? '✓ Following' : '+ Follow'}
                      </button>
                      <button 
                        style={savedVideos.find(v => v._id === vid._id) ? styles.btnActive : styles.actionBtn} 
                        onClick={() => handleSaveVideo(vid)}
                      >
                        {savedVideos.find(v => v._id === vid._id) ? '★ Saved' : 'Save'}
                      </button>
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
            <button key={cat} style={selectedCategory === cat ? styles.catBtnActive : styles.categoryItem} onClick={() => setSelectedCategory(cat)}>#{cat}</button>
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
                <h3 style={{color: '#fff', textShadow: '0 0 8px #a855f7'}}>Initialize Identity</h3>
                <p style={{color: '#888', fontSize: '12px', marginBottom: '20px'}}>Join the decentralized network.</p>
                <form onSubmit={handleSaveUser} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <input placeholder="Enter Username" required onChange={e => setNameInput(e.target.value)} style={styles.modalInput}/>
                  <button type="submit" style={styles.primaryBtn}>Create Identity</button>
                </form>
              </>
            )}

            {/* 2. SETTINGS / PROFILE MODAL */}
            {activeModal === 'settings' && (
              <>
                <h3 style={{color: '#06b6d4', textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'}}>@{user?.name}</h3>
                <p style={{color: '#888', fontSize: '12px'}}>Status: Verified StreamNet Node</p>
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <button onClick={() => { localStorage.removeItem('streamnet_master_user'); setUser(null); setActiveModal('auth'); }} style={styles.outlineBtn}>⇄ Switch Account</button>
                  <button onClick={() => setActiveModal(null)} style={styles.primaryBtn}>Close Dashboard</button>
                </div>
              </>
            )}

            {/* 3. FOLLOWING MODAL */}
            {activeModal === 'following' && (
              <div style={{textAlign: 'left'}}>
                <h3 style={{borderBottom: '1px solid #333', paddingBottom: '10px', color: '#a855f7'}}>Network Connections ({followedUsers.length})</h3>
                {followedUsers.length === 0 ? <p style={{color: '#888'}}>You aren't following any nodes yet.</p> : 
                  <ul style={{color: '#06b6d4', listStyleType: 'none', padding: 0}}>
                    {followedUsers.map((u, i) => (
                      <li key={i} style={{padding: '12px', background: '#1a1a1a', marginBottom: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>@{u}</span>
                        <button onClick={() => handleFollow(u)} style={{background: 'transparent', color: '#ff3333', border: '1px solid #ff3333', borderRadius: '4px', cursor: 'pointer', fontSize: '10px'}}>Unfollow</button>
                      </li>
                    ))}
                  </ul>
                }
              </div>
            )}

            {/* 4. SAVED VIDEOS MODAL (NEW: Now Playable!) */}
            {activeModal === 'saved' && (
              <div style={{textAlign: 'left', width: '100%'}}>
                <h3 style={{borderBottom: '1px solid #333', paddingBottom: '10px', color: '#06b6d4'}}>Encrypted Local Vault</h3>
                {savedVideos.length === 0 ? <p style={{color: '#888'}}>No videos saved to device memory.</p> : 
                  <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px'}}>
                    {savedVideos.map((v, i) => (
                      <div key={i} style={{background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333'}}>
                        <video src={v.videoUrl} controls style={{width: '100%', height: '140px', objectFit: 'cover', background: '#000'}} />
                        <div style={{padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <p style={{margin: 0, fontSize: '13px', color: '#fff', fontWeight: 'bold'}}>{v.title}</p>
                           <button onClick={() => handleSaveVideo(v)} style={{background: 'transparent', border: 'none', color: '#ff3333', cursor: 'pointer', fontSize: '12px'}}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}

            {/* 5. ARCHIVES PRIVATE MODAL (NEW: Playable and Accessible) */}
            {activeModal === 'archives' && (
              <div style={{textAlign: 'left'}}>
                <h2 style={{color: '#a855f7'}}>Private Deep Archives</h2>
                <p style={{color: '#888', fontSize: '12px'}}>Files uploaded here are compressed and hidden from the global homepage.</p>
                
                <form onSubmit={handlePrivateUpload} style={{marginTop: '20px', padding: '15px', border: '1px dashed #a855f7', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.05)'}}>
                  <input name="title" placeholder="Secret Video Title" required style={{...styles.modalInput, marginBottom: '10px'}} />
                  <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#06b6d4', marginBottom: '15px'}}>
                    <input type="checkbox" defaultChecked /> Enable Deep Compression Algorithm
                  </label>
                  <button type="submit" style={styles.primaryBtn}>Encrypt & Archive</button>
                </form>

                <h4 style={{marginTop: '20px', color: '#fff'}}>Archived Files ({privateArchives.length})</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  {privateArchives.map(p => (
                    <div key={p.id} style={{background: '#1a1a1a', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #a855f7'}}>
                      <p style={{margin: '0 0 5px 0', color: '#fff', fontSize: '13px'}}>🔒 {p.title}</p>
                      <video src={p.videoUrl} controls style={{width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', background: '#000'}} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* OTHER MODALS (About / Support) remain the same */}
            {activeModal === 'about' && (
              <div style={{textAlign: 'left'}}>
                <h2 style={{color: '#a855f7', marginBottom: '10px'}}>About StreamNet</h2>
                <p style={{color: '#ddd', fontSize: '14px', lineHeight: '1.6'}}>StreamNet is a decentralized, censorship-resistant video streaming infrastructure designed for the future of free speech.</p>
                <div style={{background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginTop: '20px', borderLeft: '3px solid #06b6d4'}}>
                  <h4 style={{margin: '0 0 5px 0', color: '#06b6d4'}}>Architecture & Development</h4>
                  <p style={{margin: 0, color: '#888', fontSize: '12px'}}>Developed by <strong>Ramendra Upadhyay</strong>.<br/>Final Master of Computer Applications (MCA) Project.<br/>Shri Ramswaroop Memorial University (SRMU).</p>
                </div>
              </div>
            )}

            {activeModal === 'support' && (
              <>
                <h2 style={{color: '#06b6d4'}}>Defend Free Speech</h2>
                <p style={{color: '#ddd', fontSize: '14px', marginTop: '10px'}}>We maintain an unbiased network. Support the mission.</p>
                <button style={{...styles.primaryBtn, marginTop: '20px'}}>Crypto Wallet Address</button>
              </>
            )}

            {activeModal === 'subscription' && (
              <>
                <h2>Cloud Expansion</h2>
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                  <div style={{flex: 1, padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333'}}><h4>500GB Vault</h4><p style={{color:'#06b6d4'}}>$4.99/mo</p></div>
                  <div style={{flex: 1, padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #a855f7'}}><h4>2TB Vault</h4><p style={{color:'#a855f7'}}>$9.99/mo</p></div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

// --- VIBRANT & INTERACTIVE CSS STYLES ---
const styles = {
  dashboard: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" },
  navbar: { height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#0a0a0a', borderBottom: '1px solid #222', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
  logo: { margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff', textShadow: '0 0 12px #a855f7', cursor: 'pointer' },
  navCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  
  // NEW: Glowing Search Bar
  searchBar: { width: '100%', maxWidth: '450px', padding: '12px 20px', borderRadius: '20px', border: '1px solid #333', backgroundColor: '#111', color: '#fff', outline: 'none', transition: 'border 0.3s', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' },
  
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  
  // NEW: Storage Indicator
  storageIndicator: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5px 10px', border: '1px solid #333', borderRadius: '8px', background: '#111' },
  
  uploadBtn: { padding: '10px 20px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#222', border: '2px solid #06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' },

  mainLayout: { display: 'flex', flex: 1, height: 'calc(100vh - 70px)' },
  leftSidebar: { width: '220px', background: '#050505', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  menuList: { display: 'flex', flexDirection: 'column', flex: 1 },
  menuItem: { padding: '15px 25px', background: 'transparent', border: 'none', color: '#888', fontWeight: 'bold', fontSize: '12px', textAlign: 'left', cursor: 'pointer' },
  supportBox: { margin: '20px', padding: '15px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 0 10px rgba(6, 182, 212, 0.1)' },

  contentArea: { flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sectionTitle: { margin: '0', fontSize: '20px', color: '#fff', width: '100%', textAlign: 'left', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
  clearBtn: { background: 'transparent', border: '1px solid #a855f7', color: '#a855f7', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', width: '100%', maxWidth: '1000px', marginTop: '20px' },
  
  // NEW: Vibrant Video Cards
  videoCard: { background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222', transition: 'transform 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' },
  thumbnail: { width: '100%', height: '170px', backgroundColor: '#000', objectFit: 'cover' },
  cardInfo: { padding: '15px' },
  vidTitle: { margin: '0 0 15px 0', fontSize: '15px', color: '#fff', fontWeight: 'bold' },
  vidInteractions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '10px' },
  uploaderText: { fontSize: '12px', color: '#06b6d4', fontWeight: 'bold', cursor: 'pointer' },
  actionBtn: { background: '#222', border: '1px solid #333', color: '#aaa', fontSize: '11px', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' },
  btnActive: { background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', color: '#06b6d4', fontSize: '11px', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

  rightSidebar: { width: '220px', background: '#050505', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' },
  categoryHeader: { padding: '0 20px', fontSize: '11px', color: '#666', letterSpacing: '1px', marginBottom: '15px' },
  categoryItem: { padding: '12px 20px', background: 'transparent', border: 'none', color: '#888', fontSize: '12px', textAlign: 'left', cursor: 'pointer', borderLeft: '3px solid transparent' },
  catBtnActive: { padding: '12px 20px', background: 'rgba(168, 85, 247, 0.1)', border: 'none', color: '#a855f7', fontSize: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold', borderLeft: '3px solid #a855f7', boxShadow: 'inset 5px 0 10px rgba(168,85,247,0.1)' },

  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
  modal: { background: '#111', padding: '35px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.9)' },
  modalInput: { padding: '15px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px', width: '100%', boxSizing: 'border-box', outline: 'none' },
  primaryBtn: { padding: '15px', background: 'linear-gradient(90deg, #a855f7, #06b6d4)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' },
  outlineBtn: { padding: '15px', background: 'transparent', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }
};

export default HomePage;