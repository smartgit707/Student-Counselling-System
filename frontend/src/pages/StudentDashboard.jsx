import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, MapPin, Smile, Bell, BookOpen, Star } from 'lucide-react';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [counsellors, setCounsellors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [moods, setMoods] = useState([]);
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [activeTab, setActiveTab] = useState('book'); // book, appointments, assessments, resources, notifications

  // Booking Form State
  const [selectedCid, setSelectedCid] = useState('');
  const [adate, setAdate] = useState('');
  const [atime, setAtime] = useState('');
  const [mode, setMode] = useState('Online');
  const [remarks, setRemarks] = useState('');

  // Mood Tracker State
  const [moodScore, setMoodScore] = useState(5);
  const [moodNotes, setMoodNotes] = useState('');

  // Feedback State
  const [feedbackData, setFeedbackData] = useState({});

  useEffect(() => {
    fetchCounsellors();
    fetchAppointments();
    fetchAssessments();
    fetchMoods();
    fetchResources();
    fetchNotifications();
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

  const fetchMoods = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/mood/${user.sid}`);
      setMoods(res.data.moods);
    } catch (err) { console.error(err); }
  };

  const fetchResources = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/resources`);
      setResources(res.data.resources);
    } catch (err) { console.error(err); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/notifications/${user.sid}`);
      setNotifications(res.data.notifications);
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

  const handleLogMood = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/student/mood', {
        sid: user.sid,
        mood_score: moodScore,
        notes: moodNotes,
        log_date: new Date().toISOString().split('T')[0]
      });
      alert('Mood logged successfully!');
      setMoodScore(5);
      setMoodNotes('');
      fetchMoods();
    } catch (err) {
      alert('Failed to log mood');
    }
  };

  const submitFeedback = async (aid, cid) => {
    const rating = feedbackData[`${aid}_rating`] || 5;
    const comments = feedbackData[`${aid}_comments`] || '';
    try {
      await axios.post('http://localhost:5000/api/student/feedback', {
        aid, sid: user.sid, cid, rating, comments
      });
      alert('Feedback submitted!');
      // Simple way to hide form after submit
      setFeedbackData({...feedbackData, [`${aid}_submitted`]: true});
    } catch (err) {
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome, {user.name}</h1>
          <p className="text-muted">Manage your mental health journey here.</p>
        </div>
        <button onClick={() => setActiveTab('notifications')} className="btn" style={{ position: 'relative', background: 'white', border: '1px solid #E5E7EB', borderRadius: '50%', padding: '0.75rem' }}>
          <Bell size={20} color="var(--text-muted)" />
          {notifications.filter(n => !n.is_read).length > 0 && (
            <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', width: '12px', height: '12px', borderRadius: '50%' }}></span>
          )}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'book' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('book')} style={{ color: activeTab === 'book' ? 'white' : 'var(--text-muted)' }}>Book Session</button>
        <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('appointments')} style={{ color: activeTab === 'appointments' ? 'white' : 'var(--text-muted)' }}>My Appointments</button>
        <button className={`btn ${activeTab === 'assessments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('assessments')} style={{ color: activeTab === 'assessments' ? 'white' : 'var(--text-muted)' }}>Assessments & Mood</button>
        <button className={`btn ${activeTab === 'resources' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('resources')} style={{ color: activeTab === 'resources' ? 'white' : 'var(--text-muted)' }}><BookOpen size={16} className="mr-2"/> Resources</button>
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
          
          <div className="grid gap-6">
            <div className="card" style={{ background: 'var(--primary-color)', color: 'white' }}>
              <h3 style={{ color: 'white' }}>Need immediate help?</h3>
              <p style={{ marginTop: '1rem', opacity: 0.9 }}>If you are experiencing a crisis or emergency, please contact the campus emergency helpline immediately.</p>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Helpline: 1800-123-456</p>
                <p style={{ marginTop: '0.5rem' }}>Available 24/7 for students.</p>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-4 flex items-center gap-2"><Smile size={20}/> Daily Mood Tracker</h3>
              <form onSubmit={handleLogMood}>
                <div className="form-group">
                  <label className="form-label">How are you feeling today? (1-10)</label>
                  <input type="range" min="1" max="10" value={moodScore} onChange={(e) => setMoodScore(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }} />
                  <div className="text-center text-primary font-bold">{moodScore}/10</div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">Notes (Optional)</label>
                  <input type="text" className="form-input" value={moodNotes} onChange={(e) => setMoodNotes(e.target.value)} placeholder="Why do you feel this way?" />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Log Mood</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="grid gap-4">
          {appointments.length === 0 ? <p className="text-muted">No appointments scheduled.</p> : appointments.map(apt => (
            <div key={apt.aid} className="card">
              <div className="flex items-center justify-between mb-4">
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
              
              {apt.status === 'Completed' && !feedbackData[`${apt.aid}_submitted`] && (
                <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #E5E7EB' }}>
                  <h5 className="mb-2 flex items-center gap-2"><Star size={16} color="#F59E0B"/> Leave Feedback</h5>
                  <div className="flex gap-4">
                    <select className="form-select" style={{ width: '100px' }} onChange={(e) => setFeedbackData({...feedbackData, [`${apt.aid}_rating`]: e.target.value})}>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                    <input type="text" className="form-input flex-1" placeholder="Write a brief comment..." onChange={(e) => setFeedbackData({...feedbackData, [`${apt.aid}_comments`]: e.target.value})} />
                    <button className="btn btn-primary" onClick={() => submitFeedback(apt.aid, apt.cid)}>Submit</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4">Assessment Results</h3>
            <div className="grid gap-4">
              {assessments.length === 0 ? <p className="text-muted">No assessment records found.</p> : assessments.map(ass => (
                <div key={ass.asid} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h4 style={{ fontSize: '1.125rem' }}>Mental Health Check</h4>
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
          </div>
          <div>
            <h3 className="mb-4">Mood History</h3>
            <div className="grid gap-4">
              {moods.length === 0 ? <p className="text-muted">No mood logs yet.</p> : moods.map(mood => (
                <div key={mood.log_id} className="card flex items-center justify-between" style={{ padding: '1rem' }}>
                  <div>
                    <h5 style={{ margin: 0 }}>Score: {mood.mood_score}/10</h5>
                    <p className="text-muted text-sm" style={{ fontSize: '0.875rem' }}>{mood.notes || 'No notes added'}</p>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(mood.log_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid gap-4">
          <h3 className="mb-2">Mental Health Resources</h3>
          {resources.length === 0 ? <p className="text-muted">No resources available.</p> : resources.map(res => (
            <div key={res.resource_id} className="card">
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{res.title}</h4>
              <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
                Posted by {res.author_name} on {new Date(res.date_posted).toLocaleDateString()}
              </p>
              <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{res.content_text}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="grid gap-4">
          <h3 className="mb-2">System Notifications</h3>
          {notifications.length === 0 ? <p className="text-muted">No notifications.</p> : notifications.map(notif => (
            <div key={notif.nid} className="card flex items-start gap-4" style={{ background: notif.is_read ? 'white' : '#F0FDF4', borderLeft: notif.is_read ? 'none' : '4px solid var(--secondary-color)' }}>
              <Bell color={notif.is_read ? 'var(--text-muted)' : 'var(--secondary-color)'} />
              <div>
                <p style={{ fontWeight: notif.is_read ? 'normal' : '500' }}>{notif.message}</p>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(notif.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
