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
    <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '1.75rem' }}>Welcome Back</h2>
          <p className="text-muted">Login to access your dashboard</p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['student', 'counsellor', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: `1px solid ${role === r ? 'var(--primary-color)' : '#D1D5DB'}`,
                    background: role === r ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    color: role === r ? 'var(--primary-color)' : 'var(--text-muted)',
                    fontWeight: role === r ? 600 : 400,
                    textTransform: 'capitalize',
                    fontSize: '0.875rem'
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Login to Dashboard
          </button>
        </form>
        
        <div className="text-center mt-4 text-muted" style={{ fontSize: '0.875rem' }}>
          <p>Demo Credentials:</p>
          <p>Student: ved@gmail.com / ved123</p>
          <p>Counsellor: meena@gmail.com / 9000000001</p>
          <p>Admin: admin1 / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
