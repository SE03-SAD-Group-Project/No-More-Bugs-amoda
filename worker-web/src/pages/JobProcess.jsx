import { useState } from 'react'; // REMOVED useEffect
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
// import { verifyCustomerPin, uploadEvidence, completeJob } from '../services/api';

const JobProcess = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Steps: 1=Verify PIN, 2=Work/Upload, 3=Finish
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [jobData, setJobData] = useState(null);

  // --- STEP 1: VERIFY PIN ---
  const handlePinVerification = async (e) => {
    e.preventDefault();
    try {
      // --- MOCK LOGIC ---
      if (pin === '123456') {
        setJobData({
          _id: id,
          customerName: "Alice Green",
          needs: "Full deep clean of living room and kitchen.",
          priceRemaining: "5000 LKR",
          status: "in_progress"
        });
        setStep(2);
      } else {
        alert("❌ Incorrect PIN. Please ask the customer.");
      }
    } catch (err) {
      console.error(err); // ADDED THIS to use the 'err' variable
      alert("Verification Error");
    }
  };

  // --- STEP 2: UPLOAD IMAGES ---
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleUploadAndFinish = async () => {
    if (images.length === 0) return alert("Please upload at least one photo of the work.");
    
    setUploading(true);
    
    // Prepare Form Data for Image Upload
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      console.log("Uploading images and finishing job...");
      await new Promise(r => setTimeout(r, 2000)); // Fake delay
      
      alert("✅ Job Finished! Payment info sent to admin.");
      navigate('/');
      
    } catch (err) {
      console.error(err); // ADDED THIS to use the 'err' variable
      alert("Error uploading data.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      
      <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
        
        {/* STEP 1: PIN ENTRY */}
        {step === 1 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>🔐 Security Check</h2>
            <p>Please enter the 6-digit PIN from the customer.</p>
            
            <input 
              type="text" 
              maxLength="6"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="0 0 0 0 0 0"
              style={{ 
                fontSize: '2rem', 
                padding: '10px', 
                width: '200px', 
                letterSpacing: '8px', 
                textAlign: 'center',
                border: '2px solid #ccc',
                borderRadius: '8px'
              }}
            />
            
            <br /><br />
            <button 
              onClick={handlePinVerification}
              style={{ 
                padding: '12px 30px', 
                background: '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              Verify Code
            </button>
          </div>
        )}

        {/* STEP 2: JOB DETAILS & COMPLETION */}
        {step === 2 && jobData && (
          <div>
            <div style={{ background: '#e8f6f3', padding: '20px', borderRadius: '8px', border: '1px solid #a3e4d7' }}>
              <h3 style={{ color: '#16a085', marginTop: 0 }}>✅ Verified & Active</h3>
              <p><strong>Customer:</strong> {jobData.customerName}</p>
              <p><strong>Task:</strong> {jobData.needs}</p>
              <p><strong>To Collect:</strong> {jobData.priceRemaining}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h3>📷 Upload Evidence</h3>
              <p>Take photos of the finished area to complete the job.</p>
              
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange} 
                style={{ display: 'block', marginBottom: '20px' }}
              />

              <button 
                onClick={handleUploadAndFinish}
                disabled={uploading}
                style={{ 
                  width: '100%',
                  padding: '15px', 
                  background: uploading ? '#95a5a6' : '#2980b9', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  fontSize: '1.2rem',
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? 'Uploading...' : 'Finish Job & Collect Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobProcess;