import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- MOCK DATA ---
    setTimeout(() => {
      setJobs([
        { 
          _id: "64fc2a1b9d312", 
          customer: { name: "alice green", address: "123 palm grove, colombo 3" },
          serviceType: "deep cleaning",
          status: "booked", 
          date: "2023-10-25"
        },
        { 
          _id: "64fc2b5c8e421", 
          customer: { name: "raj perera", address: "45 lake drive, kandy" },
          serviceType: "plumbing repair",
          status: "completed", // This will be hidden in Dashboard now
          date: "2023-10-20"
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // FILTER: Only show active jobs (booked or in_progress)
  const activeJobs = jobs.filter(job => job.status !== 'completed');

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>assigned jobs</h1>
      
      {loading ? <p>loading jobs...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '20px' }}>
          {activeJobs.length === 0 && <p>no active jobs. check history for past tasks.</p>}
          
          {activeJobs.map((job) => (
            <div key={job._id} style={{ 
              border: '1px solid #444', 
              borderRadius: '8px', 
              padding: '1.5rem',
              background: '#2b2b2e', 
              borderLeft: '5px solid #3498db', // Blue for active
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{job.serviceType}</h3>
                  <p style={{ margin: '5px 0', color: '#ccc' }}>👤 <strong>{job.customer.name}</strong></p>
                  <p style={{ margin: '5px 0', color: '#ccc' }}>📍 {job.customer.address}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#888' }}>id: {job._id}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    background: 'rgba(52, 152, 219, 0.2)',
                    color: '#3498db',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    border: '1px solid #3498db'
                  }}>
                    {job.status}
                  </span>
                  
                  <button 
                    onClick={() => navigate(`/job/${job._id}`)}
                    style={{ 
                      display: 'block', 
                      marginTop: '15px', 
                      padding: '10px 20px', 
                      background: '#3498db', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    start job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;