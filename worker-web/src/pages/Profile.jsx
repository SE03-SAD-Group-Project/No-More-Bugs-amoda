import { useState, useEffect } from 'react';

const API_URL = "http://localhost:3001";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [workerId] = useState(localStorage.getItem('workerId'));

  const [formData, setFormData] = useState({
    fullName: '',
    jobPosition: 'General Worker',
    email: '',
    mobile: '',
    address: '',
    skills: '',
    profileImage: '' // --- NEW STATE FIELD ---
  });

  // 1. FETCH DATA ON LOAD
  useEffect(() => {
    if (!workerId) return;
    fetch(`${API_URL}/worker/${workerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "Success") {
          const user = data.data;
          setFormData({
            fullName: user.fullName,
            jobPosition: user.jobPosition || "General Worker",
            email: user.email,
            mobile: user.mobile,
            address: user.address,
            skills: user.skills ? user.skills.join(', ') : '',
            profileImage: user.profileImage || '' // --- FETCH IMAGE ---
          });
        }
        setLoading(false);
      })
      .catch(err => console.error("Error fetching profile:", err));
  }, [workerId]);

  // 2. HANDLE INPUT CHANGES
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- NEW: HANDLE IMAGE UPLOAD (Same logic as registration) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. HANDLE SAVE
  const handleSave = async () => {
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== "");

    const payload = {
      address: formData.address,
      mobile: formData.mobile,
      email: formData.email,
      jobPosition: formData.jobPosition,
      skills: skillsArray,
      profileImage: formData.profileImage // --- SEND IMAGE TO DB ---
    };

    try {
      const response = await fetch(`${API_URL}/worker/${workerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.status === "Success") {
        alert("✅ Profile Updated Successfully!");
        // Update local storage so sidebar updates immediately too
        localStorage.setItem('workerImage', formData.profileImage);
        setIsEditing(false);
      } else {
        alert("❌ Update Failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  if (loading) return <p style={{color:'white', padding:'20px'}}>Loading Profile...</p>;

  const inputStyle = { width: '100%', padding: '10px', background: isEditing ? '#2b2b2e' : 'transparent', border: isEditing ? '1px solid #555' : 'none', color: 'white', borderRadius: '5px', marginBottom: '10px', fontSize: '1rem', pointerEvents: isEditing ? 'auto' : 'none' };
  const labelStyle = { color: '#aaa', fontSize: '0.85rem', marginBottom: '2px', display: 'block' };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>my profile</h1>

      <div style={{ background: '#35363A', padding: '2rem', borderRadius: '15px', border: '1px solid #444', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', marginTop: '20px' }}>
        
        {/* --- UPDATED AVATAR SECTION --- */}
        <div style={{ textAlign: 'center' }}>
          
          {/* WRAPPER FOR IMAGE & UPLOAD INPUT */}
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 15px' }}>
             
             {/* THE IMAGE CIRCLE */}
            <div style={{ 
              width: '100%', height: '100%', background: '#e94560', 
              borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
              border: '4px solid #202124', overflow: 'hidden'
            }}>
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '3rem' }}>👷</span>
              )}
            </div>

            {/* UPLOAD OVERLAY (Only visible when editing) */}
            {isEditing && (
              <label htmlFor="profile-edit-upload" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '1.5rem'
              }}>
                📷
                <input id="profile-edit-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          
          <h2 style={{ color: '#fff', margin: 0 }}>{formData.fullName}</h2>
          
          {isEditing ? (
             <input name="jobPosition" value={formData.jobPosition} onChange={handleChange} style={{...inputStyle, textAlign: 'center', color: '#4cc9f0', border: '1px solid #4cc9f0', width: '60%'}} />
          ) : (
             <p style={{ color: '#4cc9f0', fontSize: '1.1rem', margin: '5px 0' }}>{formData.jobPosition}</p>
          )}
        </div>
        {/* ----------------------------- */}

        <div style={{ margin: '20px 0', borderBottom: '1px solid #555' }}></div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div><label style={labelStyle}>email address</label><input name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>mobile number</label><input name="mobile" value={formData.mobile} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>home address</label><input name="address" value={formData.address} onChange={handleChange} style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>skills (separate with commas)</label>
            {isEditing ? (
              <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Plumbing, Wiring" style={inputStyle} />
            ) : (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                {formData.skills && formData.skills.length > 0 ? (
                  formData.skills.split(',').map((skill, idx) => (
                    <span key={idx} style={{ background: '#202124', padding: '6px 12px', borderRadius: '15px', fontSize: '0.85rem', color: '#fff', border: '1px solid #555' }}>{skill.trim()}</span>
                  ))
                ) : <span style={{color:'#666', fontStyle:'italic'}}>no skills added yet</span>}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={{ width: '100%', padding: '12px', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem' }}>edit profile</button>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', background: '#555', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>cancel</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>save changes</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;