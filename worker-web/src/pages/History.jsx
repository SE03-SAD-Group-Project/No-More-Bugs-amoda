import { useEffect, useState } from 'react';

const History = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- MOCK DATA (Ideally this comes from a shared source/backend) ---
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
          status: "completed", 
          date: "2023-10-20"
        },
        { 
          _id: "64fc99z1x223", 
          customer: { name: "kamal silva", address: "89 galle road, colombo 4" },
          serviceType: "ac service",
          status: "completed", 
          date: "2023-09-15"
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // FILTER: Only show COMPLETED jobs
  const historyJobs = jobs.filter(job => job.status === 'completed');

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>job history</h1>
      
      {loading ? <p>loading history...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '20px' }}>
          {historyJobs.length === 0 && <p>no completed jobs yet.</p>}
          
          {historyJobs.map((job) => (
            <div key={job._id} style={{ 
              border: '1px solid #444', 
              borderRadius: '8px', 
              padding: '1.5rem',
              background: '#2b2b2e', // DARK CARD BG
              borderLeft: '5px solid #2ecc71', // Green for completed
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{job.serviceType}</h3>
                  <p style={{ margin: '5px 0', color: '#ccc' }}>👤 <strong>{job.customer.name}</strong></p>
                  <p style={{ margin: '5px 0', color: '#ccc' }}>📍 {job.customer.address}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#888' }}>id: {job._id}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#888' }}>date: {job.date}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    background: 'rgba(46, 204, 113, 0.2)',
                    color: '#2ecc71',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    border: '1px solid #2ecc71'
                  }}>
                    {job.status}
                  </span>
                  
                  {/* No "Start Job" button here because it's history */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;