import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from './Loader'; // IMPORT LOADER

// IMPORT ASSETS
import logoImg from '../assets/nomorebugs_logo.png'; 
import logoutIcon from '../assets/icons8-logout-48 (1).png'; 

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- PAGE LOADING STATE ---
  const [pageLoading, setPageLoading] = useState(false);
  const isFirstLoad = useRef(true);

  // GET USER DATA
  const workerName = localStorage.getItem('workerName') || 'Worker';
  const workerImage = localStorage.getItem('workerImage');

  // --- HANDLE ROUTE CHANGES (FIXED) ---
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const startTimer = setTimeout(() => {
      setPageLoading(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setPageLoading(false);
    }, 2500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);


  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* --- LEFT SIDEBAR --- */}
      <aside style={{ 
        width: isCollapsed ? '80px' : '260px', 
        background: '#000000', 
        color: '#fff', 
        display: 'flex', flexDirection: 'column', padding: '20px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)', zIndex: 100, 
        transition: 'width 0.3s ease', overflow: 'hidden', whiteSpace: 'nowrap' 
      }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>nomorebugs.</h2>
              <img src={logoImg} alt="Logo" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ background: 'transparent', border: '1px solid #4cc9f0', color: '#4cc9f0', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px', fontSize: '1.2rem', marginLeft: isCollapsed ? 0 : '10px' }}>
            {isCollapsed ? '☰' : '«'} 
          </button>
        </div>

        {/* User Info */}
        <div style={{ 
          marginBottom: '30px', 
          padding: isCollapsed ? '0' : '10px', 
          background: isCollapsed ? 'transparent' : '#202124', 
          borderRadius: '8px', 
          textAlign: 'center', 
          transition: 'all 0.3s' 
        }}>
          <div style={{ 
            width: isCollapsed ? '40px' : '50px', 
            height: isCollapsed ? '40px' : '50px', 
            background: '#000000', borderRadius: '50%', margin: '0 auto', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '2px solid #202124'
          }}>
            {workerImage ? (
               <img src={workerImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
               <span style={{ fontSize: '1.5rem' }}>👷</span>
            )}
          </div>
          
          {!isCollapsed && (
            <div style={{ marginTop: '10px', animation: 'fadeIn 0.5s' }}>
              <strong style={{ display: 'block' }}>{workerName}</strong>
              <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>● Online</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/" style={linkStyle(isActive('/'), isCollapsed)}><span style={{ fontSize: '1.2rem' }}>📊</span>{!isCollapsed && <span>Dashboard</span>}</Link>
          <Link to="/history" style={linkStyle(isActive('/history'), isCollapsed)}><span style={{ fontSize: '1.2rem' }}>🗂️</span>{!isCollapsed && <span>Job History</span>}</Link>
          <Link to="/profile" style={linkStyle(isActive('/profile'), isCollapsed)}><span style={{ fontSize: '1.2rem' }}>⚙️</span>{!isCollapsed && <span>My Profile</span>}</Link>
        </nav>

        {/* Logout Button */}
        <button onClick={handleLogout} style={{ marginTop: 'auto', padding: '12px', background: isCollapsed ? 'transparent' : '#FF0000', color: isCollapsed ? '#FF0000' : 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.3s' }} title="Logout">
          <img src={logoutIcon} alt="Logout" style={{ width: '24px', height: '24px' }} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* --- RIGHT CONTENT AREA --- */}
      <main style={{ 
        flex: 1, 
        background: '#202124', 
        overflowY: 'auto', 
        padding: '30px', 
        position: 'relative', 
        transition: 'margin-left 0.3s ease' 
      }}>
        
        {/* CONDITIONAL RENDER: Show Loader OR Page Content */}
        {pageLoading ? (
          <Loader mode="content" />
        ) : (
          <Outlet />
        )}

      </main>
    </div>
  );
};

const linkStyle = (active, isCollapsed) => ({
  textDecoration: 'none', padding: '12px 15px', borderRadius: '8px',
  color: active ? '#fff' : '#a0a0a0', background: active ? '#0f3460' : 'transparent',
  fontWeight: active ? 'bold' : 'normal', transition: '0.3s', display: 'flex',
  alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '15px'
});

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
document.head.appendChild(styleSheet);

export default Layout;