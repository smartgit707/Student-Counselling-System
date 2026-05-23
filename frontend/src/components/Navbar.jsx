import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 hover-lift" style={{ transition: 'transform 0.2s' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
          }}>
            MH
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CampusCare</h2>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-muted" style={{ fontWeight: 600 }}>
                <div style={{ background: 'var(--bg-gradient-start)', padding: '0.4rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                  <User size={18} />
                </div>
                {user.name || user.username}
                <span className="badge badge-info" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                <LogOut size={16} style={{ marginRight: '0.4rem' }}/> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
