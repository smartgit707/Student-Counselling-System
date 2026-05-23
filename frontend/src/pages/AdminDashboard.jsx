import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, Activity, AlertCircle, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, analytics

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resStudents, resCounsellors, resAnalytics] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/students'),
        axios.get('http://localhost:5000/api/admin/counsellors'),
        axios.get('http://localhost:5000/api/analytics/overview')
      ]);
      setStudents(resStudents.data.students);
      setCounsellors(resCounsellors.data.counsellors);
      setAnalytics(resAnalytics.data.analytics);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
          <p className="text-muted">Welcome, {user.username}. Overview of system users.</p>
        </div>
        <div className="flex gap-2">
          <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('overview')} style={{ color: activeTab === 'overview' ? 'white' : 'var(--text-muted)' }}>Overview</button>
          <button className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('analytics')} style={{ color: activeTab === 'analytics' ? 'white' : 'var(--text-muted)' }}><BarChart2 size={16} className="mr-2"/> Analytics</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '0.5rem' }}>
            <Users size={32} color="#1E40AF" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{students.length}</h3>
            <p className="text-muted">Registered Students</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: '#D1FAE5', padding: '1rem', borderRadius: '0.5rem' }}>
            <UserPlus size={32} color="#065F46" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{counsellors.length}</h3>
            <p className="text-muted">Active Counsellors</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4">Students Directory</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>Branch/Yr</th>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.sid} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.branch} - Y{s.year}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="mb-4">Counsellors Directory</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>Specialization</th>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>Experience</th>
                </tr>
              </thead>
              <tbody>
                {counsellors.map(c => (
                  <tr key={c.cid} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>{c.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{c.spec}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{c.experience} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className="grid gap-8 animate-fade-in">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card text-center">
              <Users size={24} className="mx-auto mb-2" color="var(--primary-color)"/>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{analytics.total_students}</h3>
              <p className="text-muted text-sm">Total Students</p>
            </div>
            <div className="card text-center">
              <Activity size={24} className="mx-auto mb-2" color="var(--secondary-color)"/>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{analytics.total_appointments}</h3>
              <p className="text-muted text-sm">Total Appointments</p>
            </div>
            <div className="card text-center" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
              <AlertCircle size={24} className="mx-auto mb-2" color="#DC2626"/>
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#991B1B' }}>{analytics.active_sos_alerts}</h3>
              <p className="text-muted text-sm" style={{ color: '#DC2626' }}>Active SOS Alerts</p>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4">Campus Mood Trends (Last 7 Days)</h3>
            <div style={{ width: '100%', height: 300 }}>
              {analytics.mood_trends && analytics.mood_trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.mood_trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="log_date" tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} stroke="var(--text-muted)" />
                    <YAxis domain={[0, 10]} stroke="var(--text-muted)" />
                    <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} />
                    <Line type="monotone" dataKey="avg_mood" name="Average Mood" stroke="var(--primary-color)" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p className="text-muted text-center mt-8">Not enough data to display trends.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
