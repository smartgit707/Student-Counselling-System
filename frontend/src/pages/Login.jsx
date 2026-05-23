import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Temporary config for port 5000 where backend is running
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role
      });
      
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        if (role === 'student') navigate('/student');
        else if (role === 'counsellor') navigate('/counsellor');
        else navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}>
        <div className="text-center mb-8">
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto',
            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)'
          }}>
            MH
          </div>
          <h2 style={{ fontSize: '2rem' }}>Welcome Back</h2>
          <p className="text-muted">Login to access your wellness dashboard</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#B91C1C', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group mb-6">
            <label className="form-label" style={{ textAlign: 'center' }}>I am logging in as a</label>
            <div className="grid grid-cols-3 gap-2 p-1" style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)' }}>
              {['student', 'counsellor', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: role === r ? 'white' : 'transparent',
                    color: role === r ? 'var(--primary-color)' : 'var(--text-muted)',
                    fontWeight: role === r ? 700 : 500,
                    textTransform: 'capitalize',
                    fontSize: '0.85rem',
                    boxShadow: role === r ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{role === 'admin' ? 'Username' : 'Email Address'}</label>
            <input
              type={role === 'admin' ? 'text' : 'email'}
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Enter your ${role === 'admin' ? 'username' : 'email'}`}
              required
            />
          </div>

          <div className="form-group mb-8">
            <label className="form-label">{role === 'counsellor' ? 'Phone (Password)' : 'Password'}</label>
            <input
              type={role === 'counsellor' ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            Login to Dashboard
          </button>
        </form>
        
        <div className="text-center mt-6 text-muted" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.4)', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Demo Credentials:</p>
          <p>Student: ved@gmail.com / ved123</p>
          <p>Counsellor: meena@gmail.com / 9000000001</p>
          <p>Admin: admin1 / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
