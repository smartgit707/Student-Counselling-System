import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, MapPin, Smile, Bell, BookOpen, Star, AlertTriangle, PenTool, MessageSquare, Users, Bot, X } from 'lucide-react';
import io from 'socket.io-client';
import AudioRecorder from '../components/AudioRecorder';
import VirtualPet from '../components/VirtualPet';
import CBTWorksheet from '../components/CBTWorksheet';
import FloatingSOS from '../components/FloatingSOS';

const socket = io.connect("http://localhost:5000");

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [counsellors, setCounsellors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [moods, setMoods] = useState([]);
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [journals, setJournals] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  
  const [activeTab, setActiveTab] = useState('book'); // book, appointments, assessments, resources, notifications, journal, chat, forum
  const [stats, setStats] = useState({ streak_count: 0, total_points: 0 });

  // Booking Form State
  const [selectedCid, setSelectedCid] = useState('');
  const [adate, setAdate] = useState('');
  const [atime, setAtime] = useState('');
  const [mode, setMode] = useState('Online');
  const [remarks, setRemarks] = useState('');

  // Mood Tracker State
  const [moodScore, setMoodScore] = useState(5);
  const [moodNotes, setMoodNotes] = useState('');

  // Journal State
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalShared, setJournalShared] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  // Feedback State
  const [feedbackData, setFeedbackData] = useState({});

  // Chat State
  const [currentMessage, setCurrentMessage] = useState('');

  // Forum State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // AI Chatbot State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    { sender: 'bot', text: 'Hi there! I am your AI assistant. Need some quick advice?' }
  ]);

  useEffect(() => {
    fetchCounsellors();
    fetchAppointments();
    fetchAssessments();
    fetchMoods();
    fetchResources();
    fetchNotifications();
    fetchJournals();
    fetchForumPosts();
    fetchStats();

    socket.on("receive_message", (data) => {
      setChatMessages((list) => [...list, data]);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && selectedCid) {
      const room = `student_${user.sid}_counsellor_${selectedCid}`;
      socket.emit("join_room", room);
      fetchChatMessages();
    }
  }, [activeTab, selectedCid]);

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

  const fetchJournals = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/journal/${user.sid}`);
      setJournals(res.data.journals);
    } catch (err) { console.error(err); }
  };

  const fetchForumPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forum');
      setForumPosts(res.data.posts);
    } catch (err) { console.error(err); }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${user.sid}/${selectedCid}`);
      setChatMessages(res.data.messages);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/stats/${user.sid}`);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
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
      fetchStats();
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

  const triggerSOS = async () => {
    if(window.confirm('EMERGENCY SOS: Are you sure you want to alert counsellors?')) {
      try {
        await axios.post('http://localhost:5000/api/emergency/sos', { sid: user.sid });
        alert('SOS Triggered! Help is on the way.');
      } catch(err) { alert('SOS Failed'); }
    }
  };

  const joinWaitlist = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/waitlist/join', {
        sid: user.sid, cid: selectedCid, request_date: adate || new Date().toISOString().split('T')[0]
      });
      alert('Joined waitlist successfully!');
    } catch(err) { alert('Failed to join waitlist'); }
  };

  const handleSaveJournal = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('sid', user.sid);
      formData.append('title', journalTitle);
      formData.append('content', journalContent);
      formData.append('is_shared', journalShared);
      if (audioFile) {
        formData.append('audio_file', audioFile, 'voice_note.webm');
      }

      const res = await axios.post('http://localhost:5000/api/journal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.ai_flag) {
        alert(res.data.aiMessage);
      } else {
        alert('Journal entry saved!');
      }
      
      setJournalTitle(''); setJournalContent(''); setJournalShared(false); setAudioFile(null);
      fetchJournals();
      fetchStats();
    } catch(err) { alert('Failed to save journal'); }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: `student_${user.sid}_counsellor_${selectedCid}`,
        sender_type: 'student',
        sender_id: user.sid,
        receiver_id: selectedCid,
        content: currentMessage,
        timestamp: new Date().toISOString()
      };

      await socket.emit("send_message", messageData);
      setChatMessages((list) => [...list, messageData]);
      await axios.post('http://localhost:5000/api/chat', messageData);
      setCurrentMessage("");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forum', { sid: user.sid, title: newPostTitle, content: newPostContent });
      alert('Post created!');
      setNewPostTitle(''); setNewPostContent('');
      fetchForumPosts();
    } catch(err) { alert('Failed to create post'); }
  };

  const sendAiMessage = async () => {
    if (aiMessage.trim() !== '') {
      const userMsg = { sender: 'user', text: aiMessage };
      setAiChatHistory(prev => [...prev, userMsg]);
      setAiMessage('');
      
      try {
        const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMsg.text });
        setAiChatHistory(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
      } catch(err) {
        setAiChatHistory(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
      }
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome, {user.name}</h1>
          <p className="text-muted">Manage your mental health journey here.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', display: 'flex', gap: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span>🔥 {stats.streak_count || 0} Day Streak</span>
            <span>🏆 {stats.total_points || 0} Points</span>
          </div>
          <button onClick={() => setActiveTab('notifications')} className="btn" style={{ position: 'relative', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '0.75rem' }}>
            <Bell size={20} color="var(--text-muted)" />
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', width: '12px', height: '12px', borderRadius: '50%' }}></span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'book' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('book')} style={{ color: activeTab === 'book' ? 'white' : 'var(--text-muted)' }}>Book Session</button>
        <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('appointments')} style={{ color: activeTab === 'appointments' ? 'white' : 'var(--text-muted)' }}>My Appointments</button>
        <button className={`btn ${activeTab === 'assessments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('assessments')} style={{ color: activeTab === 'assessments' ? 'white' : 'var(--text-muted)' }}>Assessments & Mood</button>
        <button className={`btn ${activeTab === 'chat' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('chat')} style={{ color: activeTab === 'chat' ? 'white' : 'var(--text-muted)' }}><MessageSquare size={16} className="mr-2"/> Chat</button>
        <button className={`btn ${activeTab === 'forum' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('forum')} style={{ color: activeTab === 'forum' ? 'white' : 'var(--text-muted)' }}><Users size={16} className="mr-2"/> Community</button>
        <button className={`btn ${activeTab === 'journal' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('journal')} style={{ color: activeTab === 'journal' ? 'white' : 'var(--text-muted)' }}><PenTool size={16} className="mr-2"/> Journal</button>
        <button className={`btn ${activeTab === 'wellness' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('wellness')} style={{ color: activeTab === 'wellness' ? 'white' : 'var(--text-muted)' }}>🌱 Pet & Quests</button>
        <button className={`btn ${activeTab === 'cbt' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('cbt')} style={{ color: activeTab === 'cbt' ? 'white' : 'var(--text-muted)' }}>🧠 Clinical Tools</button>
        <button className={`btn ${activeTab === 'resources' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('resources')} style={{ color: activeTab === 'resources' ? 'white' : 'var(--text-muted)' }}><BookOpen size={16} className="mr-2"/> Resources</button>
      </div>

      {activeTab === 'book' && (
        <div className="grid md:grid-cols-2 gap-8 stagger-1">
          <div className="glass-card">
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
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Booking</button>
                <button type="button" onClick={joinWaitlist} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>Join Waitlist</button>
              </div>
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
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                    <div style={{ background: 'rgba(243, 244, 246, 0.1)', padding: '0.5rem', borderRadius: '0.25rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{ass.anxiety}/10</div>
                      <div style={{ fontSize: '0.75rem' }} className="text-muted">Anxiety</div>
                    </div>
                    <div style={{ background: 'rgba(243, 244, 246, 0.1)', padding: '0.5rem', borderRadius: '0.25rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{ass.depression}/10</div>
                      <div style={{ fontSize: '0.75rem' }} className="text-muted">Depression</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #3B82F6' }}>
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

      {activeTab === 'journal' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2"><PenTool size={20}/> New Private Journal</h3>
            <form onSubmit={handleSaveJournal}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={journalTitle} onChange={(e) => setJournalTitle(e.target.value)} required />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Content (Optional if Voice Note)</label>
                <textarea className="form-input" rows="5" value={journalContent} onChange={(e) => setJournalContent(e.target.value)} placeholder="Write your thoughts here..."></textarea>
              </div>
              <AudioRecorder onRecordingComplete={setAudioFile} />
              <div className="form-group mb-6 flex items-center gap-2">
                <input type="checkbox" id="shareCheck" checked={journalShared} onChange={(e) => setJournalShared(e.target.checked)} />
                <label htmlFor="shareCheck" className="text-muted" style={{ fontSize: '0.875rem' }}>Share this entry with my counsellor</label>
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Save Entry</button>
            </form>
          </div>
          
          <div className="grid gap-4">
            <h3 className="mb-2">My Journal Entries</h3>
            {journals.length === 0 ? <p className="text-muted">No entries yet.</p> : journals.map(j => (
              <div key={j.entry_id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{j.title}</h4>
                  {j.is_shared ? <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Shared</span> : <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Private</span>}
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>{new Date(j.timestamp).toLocaleString()}</p>
                {j.content && <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', marginBottom: j.audio_file_path ? '1rem' : '0' }}>{j.content}</p>}
                {j.audio_file_path && (
                  <audio controls src={`http://localhost:5000${j.audio_file_path}`} style={{ width: '100%', height: '35px' }} />
                )}
                {j.detected_emotion && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    AI Analysis: <span className="font-medium text-primary capitalize">{j.detected_emotion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', height: '600px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <h3 className="flex items-center gap-2"><MessageSquare size={20}/> Chat with Counsellor</h3>
            <select className="form-select" style={{ width: 'auto' }} value={selectedCid} onChange={e => setSelectedCid(e.target.value)}>
              {counsellors.map(c => (
                <option key={c.cid} value={c.cid}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.length === 0 ? <p className="text-muted text-center mt-8">No messages yet. Say hi!</p> : chatMessages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender_type === 'student' ? 'flex-end' : 'flex-start', background: msg.sender_type === 'student' ? 'var(--primary-color)' : 'white', color: msg.sender_type === 'student' ? 'white' : 'var(--text-color)', padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomRightRadius: msg.sender_type === 'student' ? 0 : '1rem', borderBottomLeftRadius: msg.sender_type === 'student' ? '1rem' : 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '80%' }}>
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

      {activeTab === 'forum' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="card">
              <h3 className="mb-4">Create Post</h3>
              <form onSubmit={handleCreatePost}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-input" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} required />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">Content</label>
                  <textarea className="form-input" rows="4" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} required placeholder="Share your thoughts..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }}>Post to Community</button>
              </form>
            </div>
          </div>
          <div className="md:col-span-2 grid gap-4">
            <h3 className="mb-2 flex items-center gap-2"><Users size={20}/> Community Discussions</h3>
            {forumPosts.length === 0 ? <p className="text-muted">No posts yet.</p> : forumPosts.map(post => (
              <div key={post.post_id} className="card">
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }}>{post.title}</h4>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>Posted by {post.student_name || 'Anonymous'} on {new Date(post.timestamp).toLocaleString()}</p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Chatbot Widget */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
        {isAiOpen && (
          <div className="card mb-4 animate-fade-in" style={{ width: '300px', height: '400px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2"><Bot size={20}/> <strong>AI Assistant</strong></div>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aiChatHistory.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--primary-color)' : 'white', color: msg.sender === 'user' ? 'white' : 'var(--text-color)', padding: '0.5rem 0.75rem', borderRadius: '1rem', borderBottomRightRadius: msg.sender === 'user' ? 0 : '1rem', borderBottomLeftRadius: msg.sender === 'user' ? '1rem' : 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '85%', fontSize: '0.875rem' }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.5rem' }}>
              <input type="text" className="form-input flex-1" value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()} placeholder="Ask something..." style={{ fontSize: '0.875rem' }} />
              <button className="btn btn-primary" onClick={sendAiMessage} style={{ padding: '0.5rem' }}>Send</button>
            </div>
          </div>
        )}
        {!isAiOpen && (
          <button onClick={() => setIsAiOpen(true)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}>
            <Bot size={30} />
          </button>
        )}
      </div>

      {activeTab === 'wellness' && (
        <div className="grid md:grid-cols-2 gap-8 h-full" style={{ minHeight: '600px' }}>
          <VirtualPet sid={user.sid} />
          <div className="card h-full">
            <h3 className="mb-4 text-primary">About Your Wellness Pet</h3>
            <p className="text-muted mb-4">
              Your wellness pet grows as you take care of your mental health! 
              Complete daily quests, attend sessions, and log your mood to gain XP and level up your pet.
            </p>
            <ul className="list-disc pl-5 text-muted space-y-2">
              <li>Level 1: 🌱 Seed</li>
              <li>Level 2: 🌿 Sprout</li>
              <li>Level 5: 🪴 Potted Plant</li>
              <li>Level 10: 🌳 Tree</li>
              <li>Level 20: 🌸 Blooming Tree</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'cbt' && (
        <div className="h-full stagger-1" style={{ minHeight: '600px', maxWidth: '900px', margin: '0 auto' }}>
          <CBTWorksheet sid={user.sid} />
        </div>
      )}

      {/* Floating Interactive Action Menu */}
      <FloatingSOS sid={user.sid} />
    </div>
  );
};

export default StudentDashboard;
