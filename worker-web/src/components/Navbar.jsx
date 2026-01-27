import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('workerToken');
    localStorage.removeItem('workerName');
    navigate('/login');
  };

  const workerName = localStorage.getItem('workerName') || 'Worker';

  return (
    <nav style={{ 
      padding: '1rem', 
      background: '#2c3e50', 
      color: '#ecf0f1', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0 }}>👷 {workerName}'s Portal</h2>
      <button 
        onClick={handleLogout} 
        style={{ 
          background: '#e74c3c', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;