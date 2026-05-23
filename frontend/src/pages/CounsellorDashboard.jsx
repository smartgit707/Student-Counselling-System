import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000");

const CounsellorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedSid, setSelectedSid] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  
  const [activeTab, setActiveTab] = useState('alerts'); // alerts, appointments, feedback, resources, chat

  // Session Notes State
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [activeAid, setActiveAid] = useState(null);

  // Resource State
  const [resTitle, setResTitle] = useState('');
  const [resContent, setResContent] = useState('');

  // Derived unique students for chat
  const uniqueStudents = Array.from(new Set(appointments.map(a => a.sid)))
    .map(sid => appointments.find(a => a.sid === sid));

  useEffect(() => {
    fetchAppointments();
    fetchFeedbacks();
    fetchAlerts();

    socket.on("receive_message", (data) => {
      setChatMessages((list) => [...list, data]);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && selectedSid) {
      const room = `student_${selectedSid}_counsellor_${user.cid}`;
      socket.emit("join_room", room);
      fetchChatMessages();
    }
  }, [activeTab, selectedSid]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/counsellor/appointments/${user.cid}`);
      setAppointments(res.data.appointments);
      // Auto-select first student for chat
      if(res.data.appointments.length > 0 && !selectedSid) {
        setSelectedSid(res.data.appointments[0].sid);
      }
    } catch (err) { console.error(err); }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/counsellor/feedback/${user.cid}`);
      setFeedbacks(res.data.feedback);
    } catch (err) { console.error(err); }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/emergency/alerts');
      setAlerts(res.data.alerts);
    } catch (err) { console.error(err); }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${selectedSid}/${user.cid}`);
      setChatMessages(res.data.messages);
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

  const resolveAlert = async (alert_id) => {
    try {
      await axios.put(`http://localhost:5000/api/emergency/resolve/${alert_id}`, { cid: user.cid });
      alert('Alert marked as resolved');
      fetchAlerts();
    } catch (err) { alert('Failed to resolve alert'); }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: `student_${selectedSid}_counsellor_${user.cid}`,
        sender_type: 'counsellor',
        sender_id: user.cid,
        receiver_id: selectedSid,
        content: currentMessage,
        timestamp: new Date().toISOString()
      };

      await socket.emit("send_message", messageData);
      setChatMessages((list) => [...list, messageData]);
      await axios.post('http://localhost:5000/api/chat', messageData);
      setCurrentMessage("");
    }
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
        <button className={`btn ${activeTab === 'alerts' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('alerts')} style={{ color: activeTab === 'alerts' ? 'white' : 'var(--text-muted)', background: activeTab === 'alerts' ? '#DC2626' : 'transparent', borderColor: activeTab === 'alerts' ? '#DC2626' : '#E5E7EB' }}>
          <AlertTriangle size={16} className="mr-2"/> SOS & AI Alerts
          {alerts.filter(a => a.status === 'Active').length > 0 && (
            <span style={{ background: 'white', color: '#DC2626', padding: '2px 6px', borderRadius: '10px', fontSize: '0.75rem', marginLeft: '8px', fontWeight: 'bold' }}>{alerts.filter(a => a.status === 'Active').length}</span>
          )}
        </button>
        <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('appointments')} style={{ color: activeTab === 'appointments' ? 'white' : 'var(--text-muted)' }}>Appointments</button>
        <button className={`btn ${activeTab === 'chat' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('chat')} style={{ color: activeTab === 'chat' ? 'white' : 'var(--text-muted)' }}><MessageSquare size={16} className="mr-2"/> Chat</button>
        <button className={`btn ${activeTab === 'feedback' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('feedback')} style={{ color: activeTab === 'feedback' ? 'white' : 'var(--text-muted)' }}><Star size={16} className="mr-2"/> Reviews</button>
        <button className={`btn ${activeTab === 'resources' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('resources')} style={{ color: activeTab === 'resources' ? 'white' : 'var(--text-muted)' }}><BookOpen size={16} className="mr-2"/> Publish Resource</button>
      </div>

      {activeTab === 'alerts' && (
        <div className="grid gap-4">
          <h3 className="mb-2 text-danger flex items-center gap-2" style={{ color: '#DC2626' }}><AlertTriangle/> Active Crisis Alerts</h3>
          {alerts.length === 0 ? <p className="text-muted">No active alerts. All good!</p> : alerts.map(alert => (
            <div key={alert.alert_id} className="card flex justify-between items-start" style={{ borderLeft: `4px solid ${alert.status === 'Active' ? '#DC2626' : '#10B981'}`, opacity: alert.status === 'Active' ? 1 : 0.6 }}>
              <div>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {alert.student_name}
                  <span className={`badge ${alert.status === 'Active' ? 'badge-danger' : 'badge-success'}`}>{alert.status}</span>
                </h4>
                <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
                  <strong>Phone:</strong> {alert.phone} | <strong>Branch:</strong> {alert.branch}
                </p>
                <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                  Triggered on: {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {alert.status === 'Active' && (
                <button className="btn btn-primary" style={{ background: '#10B981', borderColor: '#10B981' }} onClick={() => resolveAlert(alert.alert_id)}>
                  <CheckCircle size={16} className="mr-2"/> Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}

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

      {activeTab === 'chat' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', height: '600px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <h3 className="flex items-center gap-2"><MessageSquare size={20}/> Chat with Students</h3>
            <select className="form-select" style={{ width: 'auto' }} value={selectedSid} onChange={e => setSelectedSid(Number(e.target.value))}>
              {uniqueStudents.map(s => (
                <option key={s.sid} value={s.sid}>{s.student_name} ({s.branch})</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#F9FAFB', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.length === 0 ? <p className="text-muted text-center mt-8">No messages yet. Say hi!</p> : chatMessages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender_type === 'counsellor' ? 'flex-end' : 'flex-start', background: msg.sender_type === 'counsellor' ? 'var(--primary-color)' : 'white', color: msg.sender_type === 'counsellor' ? 'white' : 'var(--text-color)', padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomRightRadius: msg.sender_type === 'counsellor' ? 0 : '1rem', borderBottomLeftRadius: msg.sender_type === 'counsellor' ? '1rem' : 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '80%' }}>
                <p style={{ margin: 0 }}>{msg.content}</p>
                <span style={{ fontSize: '0.65rem', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" className="form-input flex-1" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type your message..." />
            <button className="btn btn-primary" onClick={sendMessage}>Send</button>
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
