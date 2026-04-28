import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resStudents, resCounsellors] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/students'),
        axios.get('http://localhost:5000/api/admin/counsellors')
      ]);
      setStudents(resStudents.data.students);
      setCounsellors(resCounsellors.data.counsellors);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
        <p className="text-muted">Welcome, {user.username}. Overview of system users.</p>
      </div>

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
    </div>
  );
};

export default AdminDashboard;
