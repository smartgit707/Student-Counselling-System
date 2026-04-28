import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, MapPin } from 'lucide-react';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [counsellors, setCounsellors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState('book'); // book, appointments, assessments

  // Booking Form State
  const [selectedCid, setSelectedCid] = useState('');
  const [adate, setAdate] = useState('');
  const [atime, setAtime] = useState('');
  const [mode, setMode] = useState('Online');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchCounsellors();
    fetchAppointments();
    fetchAssessments();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/student/counsellors');
      setCounsellors(res.data.counsellors);
      if(res.data.counsellors.length > 0) setSelectedCid(res.data.counsellors[0].cid);
    } catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/appointments/${user.sid}`);
      setAppointments(res.data.appointments);
    } catch (err) { console.error(err); }
  };

  const fetchAssessments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/assessments/${user.sid}`);
      setAssessments(res.data.assessments);
    } catch (err) { console.error(err); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/student/appointments', {
        sid: user.sid,
        cid: selectedCid,
        adate,
        atime,
        mode,
        remarks
      });
      alert('Appointment booked successfully!');
      fetchAppointments();
      setActiveTab('appointments');
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome, {user.name}</h1>
          <p className="text-muted">Manage your mental health journey here.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'book' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('book')} style={{ color: activeTab === 'book' ? 'white' : 'var(--text-muted)' }}>Book Session</button>
        <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('appointments')} style={{ color: activeTab === 'appointments' ? 'white' : 'var(--text-muted)' }}>My Appointments</button>
        <button className={`btn ${activeTab === 'assessments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('assessments')} style={{ color: activeTab === 'assessments' ? 'white' : 'var(--text-muted)' }}>My Assessments</button>
      </div>

      {activeTab === 'book' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="mb-4">Book New Appointment</h3>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Select Counsellor</label>
                <select className="form-select" value={selectedCid} onChange={e => setSelectedCid(e.target.value)} required>
                  {counsellors.map(c => (
                    <option key={c.cid} value={c.cid}>
                      {c.name} - {c.spec} (Exp: {c.experience} yrs)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-input" value={adate} onChange={e => setAdate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-input" value={atime} onChange={e => setAtime(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mode</label>
                <select className="form-select" value={mode} onChange={e => setMode(e.target.value)}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div className="form-group mb-6">
                <label className="form-label">Remarks (Optional)</label>
                <input type="text" className="form-input" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="How are you feeling?" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Confirm Booking</button>
            </form>
          </div>
          
          <div className="card" style={{ background: 'var(--primary-color)', color: 'white' }}>
            <h3 style={{ color: 'white' }}>Need immediate help?</h3>
            <p style={{ marginTop: '1rem', opacity: 0.9 }}>If you are experiencing a crisis or emergency, please contact the campus emergency helpline immediately.</p>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Helpline: 1800-123-456</p>
              <p style={{ marginTop: '0.5rem' }}>Available 24/7 for students.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="grid gap-4">
          {appointments.length === 0 ? <p className="text-muted">No appointments scheduled.</p> : appointments.map(apt => (
            <div key={apt.aid} className="card flex items-center justify-between">
              <div>
                <h4 style={{ fontSize: '1.125rem' }}>{apt.counsellor_name}</h4>
                <div className="flex gap-4 mt-2 text-muted" style={{ fontSize: '0.875rem' }}>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(apt.adate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {apt.atime}</span>
                  <span className="flex items-center gap-1">{apt.mode === 'Online' ? <Video size={14}/> : <MapPin size={14}/>} {apt.mode}</span>
                </div>
              </div>
              <div>
                <span className={`badge ${apt.status === 'Scheduled' ? 'badge-warning' : 'badge-success'}`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="grid md:grid-cols-2 gap-4">
          {assessments.length === 0 ? <p className="text-muted">No assessment records found.</p> : assessments.map(ass => (
            <div key={ass.asid} className="card">
              <div className="flex justify-between items-start mb-4">
                <h4 style={{ fontSize: '1.125rem' }}>Assessment Results</h4>
                <span className={`badge ${ass.level === 'Low' ? 'badge-success' : ass.level === 'Moderate' ? 'badge-warning' : 'badge-danger'}`}>
                  Level: {ass.level}
                </span>
              </div>
              <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>Taken on: {new Date(ass.test_date).toLocaleDateString()}</p>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div style={{ background: '#F3F4F6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{ass.stress}/10</div>
                  <div style={{ fontSize: '0.75rem' }} className="text-muted">Stress</div>
                </div>
                <div style={{ background: '#F3F4F6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{ass.anxiety}/10</div>
                  <div style={{ fontSize: '0.75rem' }} className="text-muted">Anxiety</div>
                </div>
                <div style={{ background: '#F3F4F6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{ass.depression}/10</div>
                  <div style={{ fontSize: '0.75rem' }} className="text-muted">Depression</div>
                </div>
              </div>
              <div style={{ background: '#E0EEF6', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Recommendation:</strong>
                <p style={{ fontSize: '0.875rem', color: '#1E40AF' }}>{ass.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
