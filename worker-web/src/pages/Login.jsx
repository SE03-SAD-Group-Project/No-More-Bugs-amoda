import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWorker, registerWorker } from '../services/api';
import Loader from '../components/Loader';
import Notification from '../components/Notification'; // 1. IMPORT NOTIFICATION

// IMPORT YOUR IMAGE
import bgImage from '../assets/nomorebugs_logo-removebg-preview.png'; 

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // --- NEW STATE FOR POPUPS ---
  const [notify, setNotify] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIN STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- REGISTER STATE ---
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    sex: '',
    birthday: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '' 
  });

  // --- HELPER TO SHOW NOTIFICATION (VANISHES IN 2s) ---
  const showNotification = (msg, type) => {
    setNotify({ message: msg, type: type });
    setTimeout(() => {
      setNotify({ message: '', type: '' });
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- LOGIN LOGIC ---
// --- UPDATED LOGIN FUNCTION (With Security Check) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Call the API
    const result = await loginWorker(loginEmail, loginPassword);

    if (result.status === "Success") {
      
      // 1. SECURITY CHECK: Is the user pending?
      // If the database says "pending", we STOP them here.
      if (result.user.status === 'pending') {
        showNotification("Account Pending Approval", "error");
        return; // STOP EXECUTION. Do not save token, do not navigate.
      }

      // 2. If Active: Show Success Popup
      showNotification("Login Successful!", "success");

      // 3. Save data to Local Storage
      localStorage.setItem('workerToken', 'logged-in'); 
      localStorage.setItem('workerName', result.user.fullName);
      localStorage.setItem('workerId', result.user._id);
      localStorage.setItem('workerImage', result.user.profileImage || ''); 
      
      // 4. START THE ANIMATION SEQUENCE
      // Wait 2 seconds for the success popup to fade...
      setTimeout(() => {
        
        // Start the Bear Loader
        setIsLoading(true);

        // Wait 5 seconds for the loader animation...
        setTimeout(() => {
          setIsLoading(false);
          // Finally, go to the Dashboard
          navigate('/');
        }, 5000); 

      }, 2000); 

    } else {
      // Login Failed (Wrong password or email)
      showNotification(result.message || "Invalid Credentials", "error");
    }
  };
  
  // --- REGISTER LOGIC ---
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords Do Not Match", "error");
      return;
    }

    const result = await registerWorker(formData);

    if (result.status === "Success") {
      // Show Success Popup
      showNotification("Registration Successful!", "success");
      
      // Switch back to Login view after 2 seconds
      setTimeout(() => {
        setIsRegistering(false); 
        setFormData({ ...formData, profileImage: '' }); 
      }, 2000);
      
    } else {
      showNotification(result.message || "Registration Failed", "error");
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px', fontSize: '1rem',
    background: '#1a1a1d', border: '1px solid #444',
    color: 'white', borderRadius: '6px', marginTop: '5px'
  };

  const yellowButtonStyle = {
    flex: 1, padding: '14px', background: '#FDDA0D',
    border: 'none', borderRadius: '6px', fontSize: '1.1rem',
    fontWeight: 'bold', cursor: 'pointer', color: 'black'
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: '#000000', overflow: 'hidden' }}>
      
      {/* --- RENDER NOTIFICATION COMPONENT --- */}
      <Notification message={notify.message} type={notify.type} />

      {/* --- RENDER LOADER --- */}
      {isLoading && <Loader />}

      {/* BACKGROUND IMAGE BOX */}
      <div style={{
        position: 'absolute', top: 0, left: 0, height: '40%', width: '20%', 
        marginLeft: '270px', marginTop: '10px',
        backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
      }}></div>

      {/* FORM CONTAINER */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        zIndex: 10, background: 'rgba(32, 33, 36, 0.75)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2.5rem', borderRadius: '12px', 
        width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', 
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        
        <h1 style={{ color: '#fff', margin: '0 0 20px 0', fontSize: '2rem' }}>
          {isRegistering ? 'worker registration' : 'worker login'}
        </h1>

        {/* Removed the old error paragraph here since we use the popup now */}
        
        {/* --- LOGIN FORM --- */}
        {!isRegistering ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem', marginLeft: '5px' }}>email address</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ textAlign: 'left' }}>
               <label style={{ color: '#aaa', fontSize: '0.9rem', marginLeft: '5px' }}>password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={yellowButtonStyle}>sign in</button>
              <button type="button" onClick={() => setIsRegistering(true)} style={yellowButtonStyle}>register</button>
            </div>
          </form>
        ) : (
          /* --- REGISTRATION FORM --- */
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
              <label htmlFor="profile-upload" style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{
                   width: '100px', height: '100px', borderRadius: '50%',
                   background: '#1a1a1d', border: '2px dashed #444',
                   display: 'flex', justifyContent: 'center', alignItems: 'center',
                   overflow: 'hidden'
                }}>
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>📷</span>
                  )}
                </div>
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
              <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '5px' }}>tap to upload photo</p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>full name</label>
              <input type="text" name="fullName" onChange={handleChange} required style={inputStyle} placeholder="john doe" />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>address</label>
              <input type="text" name="address" onChange={handleChange} required style={inputStyle} placeholder="123 street, city" />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>sex</label>
              <div style={{ display: 'flex', gap: '20px', paddingLeft: '5px' }}>
                <label style={{ color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" name="sex" value="male" onChange={handleChange} required /> male
                </label>
                <label style={{ color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" name="sex" value="female" onChange={handleChange} required /> female
                </label>
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>birthday</label>
              <input type="date" name="birthday" onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>mobile number</label>
              <input type="tel" name="mobile" onChange={handleChange} required style={inputStyle} placeholder="077 123 4567" />
            </div>

             <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>email</label>
              <input type="email" name="email" onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>password</label>
              <input type="password" name="password" onChange={handleChange} required style={inputStyle} placeholder="create password" />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.9rem' }}>confirm password</label>
              <input type="password" name="confirmPassword" onChange={handleChange} required style={inputStyle} placeholder="repeat password" />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setIsRegistering(false)} style={{ flex: 1, padding: '14px', background: '#555', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>back to login</button>
              <button type="submit" style={yellowButtonStyle}>submit</button>
            </div>
          </form>
        )}
      </div>





      
    </div>
  );
};

export default Login;