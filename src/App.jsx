import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [role, setRole] = useState(''); 
  const [name, setName] = useState('');
  const [extraInfo, setExtraInfo] = useState(''); 
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all doctors who are currently live "On-Call"
  const fetchLiveDoctors = async () => {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('is_on_call', true);
    if (!error && data) setDoctors(data);
  };

  useEffect(() => {
    fetchLiveDoctors();
    // Refresh the list automatically every 5 seconds so updates are quick
    const interval = setInterval(fetchLiveDoctors, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle a simple simulation registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Registering...');

    // Generate a temporary mock ID structure that fits database formats easily for the MVP
    const mockId = Math.random().toString(36).substring(7);
    const formattedMockId = '00000000-0000-0000-0000-' + mockId.padStart(12, '0');

    if (role === 'doctor') {
      const { error } = await supabase.from('doctor_profiles').insert([{
        id: formattedMockId, 
        full_name: name,
        specialization: extraInfo,
        license_number: 'LIC-' + Math.floor(Math.random() * 10000),
        is_on_call: true
      }]);
      
      if (error) {
        setMessage('Error: ' + error.message);
      } else {
        setMessage('Doctor Registered & Set to On-Call Active!');
        setName('');
        setExtraInfo('');
        fetchLiveDoctors();
      }
    } else {
      // For caregivers in this quick layout, we register them successfully on screen
      setMessage('Caregiver registered successfully! Browse live doctors below.');
      setName('');
      setExtraInfo('');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>🧩 Autism Care Marketplace</h2>
        <p>Instant On-Call Connection for Caregivers & Doctors</p>
      </header>

      {/* Registration Form Box */}
      <section style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Join the Platform</h3>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>I am a: </label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">-- Select Role --</option>
              <option value="caregiver">Caregiver / Parent</option>
              <option value="doctor">Medical Expert / Doctor</option>
            </select>
          </div>

          {role && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Full Name: </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>{role === 'doctor' ? 'Area of Specialization:' : 'Primary Patient Needs:'} </label>
                <input type="text" value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                Register Active Status
              </button>
            </>
          )}
        </form>
        {message && <p style={{ color: '#2563eb', fontWeight: 'bold', marginTop: '12px', marginBottom: 0 }}>{message}</p>}
      </section>

      {/* Live On-Call Directory Box */}
      <section>
        <h3>🚨 On-Call Specialists Live Now</h3>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '-8px', marginBottom: '15px' }}>Refreshes live automatically. Click to call directly.</p>
        
        {doctors.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic', background: '#fafafa', padding: '15px', borderRadius: '6px', textAlign: 'center', border: '1px dashed #ddd' }}>
            No doctors currently on-call. Check back shortly.
          </p>
        ) : (
          doctors.map((doc, idx) => (
            <div key={idx} style={{ border: '1px solid #e4e4e7', padding: '15px', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <div>
                <strong style={{ fontSize: '1.1em', color: '#111' }}>Dr. {doc.full_name}</strong>
                <div style={{ color: '#666', fontSize: '0.9em', marginTop: '2px' }}>{doc.specialization}</div>
              </div>
              <a href="tel:+1234567890" style={{ background: '#16a34a', color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em' }}>
                📞 Call Expert
              </a>
            </div>
          ))
        )}
      </section>
    </div>
  );
}