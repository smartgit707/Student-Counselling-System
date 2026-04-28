import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CounsellorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [activeAid, setActiveAid] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/counsellor/appointments/${user.cid}`);
      setAppointments(res.data.appointments);
    } catch (err) { console.error(err); }
  };

  const handleStatusUpdate = async (aid, status) => {
    try {
      await axios.put(`http://localhost:5000/api/counsellor/appointments/${aid}/status`, { status });
      fetchAppointments();
    } catch (err) { alert('Failed to update status'); }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/counsellor/sessions', {
        aid: activeAid,
        notes,
        next_meeting: nextDate
      });
      alert('Session record saved');
      setNotes('');
      setNextDate('');
      setActiveAid(null);
    } catch (err) { alert('Failed to save session'); }
  };

  return (
    <div className="container animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '2rem' }}>Counsellor Portal</h1>
        <p className="text-muted">Welcome, Dr. {user.name}. Here are your scheduled appointments.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4">Appointments</h3>
          <div className="grid gap-4">
            {appointments.map(apt => (
              <div key={apt.aid} className={`card ${activeAid === apt.aid ? 'ring-2' : ''}`} style={{ borderColor: activeAid === apt.aid ? 'var(--primary-color)' : 'transparent', borderWidth: activeAid === apt.aid ? '2px' : '0px' }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 style={{ fontSize: '1.125rem' }}>{apt.student_name} ({apt.branch}, Yr {apt.year})</h4>
                  <span className={`badge ${apt.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{apt.status}</span>
                </div>
                <div className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
                  {new Date(apt.adate).toLocaleDateString()} at {apt.atime} • {apt.mode}
                </div>
                <p className="mb-4" style={{ fontSize: '0.875rem', background: '#F3F4F6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                  <strong>Remarks:</strong> {apt.remarks || 'None'}
                </p>
                
                <div className="flex gap-2">
                  {apt.status !== 'Completed' && (
                    <button className="btn btn-secondary text-sm" onClick={() => handleStatusUpdate(apt.aid, 'Completed')}>Mark Completed</button>
                  )}
                  <button className="btn btn-primary text-sm" onClick={() => setActiveAid(apt.aid)}>Add Session Notes</button>
                </div>
              </div>
            ))}
            {appointments.length === 0 && <p className="text-muted">No appointments found.</p>}
          </div>
        </div>

        <div>
          {activeAid ? (
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h3 className="mb-4">Add Session Notes</h3>
              <form onSubmit={handleAddSession}>
                <div className="form-group">
                  <label className="form-label">Clinical Notes</label>
                  <textarea 
                    className="form-input" 
                    rows="5" 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Enter observation notes..."
                    required
                  ></textarea>
                </div>
                <div className="form-group mb-6">
                  <label className="form-label">Next Recommended Meeting (Optional)</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={nextDate} 
                    onChange={e => setNextDate(e.target.value)} 
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary flex-1">Save Record</button>
                  <button type="button" className="btn" onClick={() => setActiveAid(null)} style={{ border: '1px solid #D1D5DB' }}>Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card text-center text-muted flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
              <p>Select an appointment to add session notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;
