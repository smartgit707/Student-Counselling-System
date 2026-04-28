import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, BookOpen } from 'lucide-react';

const CounsellorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, feedback, resources

  // Session Notes State
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [activeAid, setActiveAid] = useState(null);

  // Resource State
  const [resTitle, setResTitle] = useState('');
  const [resContent, setResContent] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchFeedbacks();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/counsellor/appointments/${user.cid}`);
      setAppointments(res.data.appointments);
    } catch (err) { console.error(err); }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/counsellor/feedback/${user.cid}`);
      setFeedbacks(res.data.feedback);
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

  const handlePublishResource = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/counsellor/resources', {
        title: resTitle,
        content_text: resContent,
        author_cid: user.cid,
        date_posted: new Date().toISOString().split('T')[0]
      });
      alert('Resource published to all students!');
      setResTitle('');
      setResContent('');
    } catch (err) { alert('Failed to publish resource'); }
  };

  return (
    <div className="container animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Counsellor Portal</h1>
          <p className="text-muted">Welcome, Dr. {user.name}.</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('appointments')} style={{ color: activeTab === 'appointments' ? 'white' : 'var(--text-muted)' }}>Appointments</button>
        <button className={`btn ${activeTab === 'feedback' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('feedback')} style={{ color: activeTab === 'feedback' ? 'white' : 'var(--text-muted)' }}><Star size={16} className="mr-2"/> Reviews & Feedback</button>
        <button className={`btn ${activeTab === 'resources' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('resources')} style={{ color: activeTab === 'resources' ? 'white' : 'var(--text-muted)' }}><BookOpen size={16} className="mr-2"/> Publish Resource</button>
      </div>

      {activeTab === 'appointments' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4">Upcoming & Past Appointments</h3>
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
                <MessageSquare size={48} color="#D1D5DB" className="mb-4" />
                <p>Select an appointment to add session notes.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div>
          <h3 className="mb-4">Student Feedback</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {feedbacks.length === 0 ? <p className="text-muted">No feedback received yet.</p> : feedbacks.map(fb => (
              <div key={fb.feedback_id} className="card">
                <div className="flex justify-between items-center mb-2">
                  <h5 style={{ fontSize: '1rem', margin: 0 }}>{fb.student_name}</h5>
                  <div className="flex items-center gap-1" style={{ color: '#F59E0B', fontWeight: 'bold' }}>
                    <Star size={16} fill="#F59E0B" /> {fb.rating}/5
                  </div>
                </div>
                <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
                  {new Date(fb.created_at).toLocaleDateString()}
                </span>
                <p style={{ fontSize: '0.875rem', fontStyle: 'italic', background: '#F9FAFB', padding: '0.75rem', borderRadius: '0.25rem' }}>
                  "{fb.comments}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="mb-4">Publish a Mental Health Resource</h3>
          <form onSubmit={handlePublishResource}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={resTitle} 
                onChange={e => setResTitle(e.target.value)} 
                placeholder="e.g. 5 Ways to Manage Exam Stress"
                required
              />
            </div>
            <div className="form-group mb-6">
              <label className="form-label">Content</label>
              <textarea 
                className="form-input" 
                rows="10" 
                value={resContent} 
                onChange={e => setResContent(e.target.value)} 
                placeholder="Write the full article or helpful tips here..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish to all Students</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default CounsellorDashboard;
