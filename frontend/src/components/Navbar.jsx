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
        <Link to="/" className="flex items-center gap-4">
          <div style={{
            background: 'var(--primary-color)',
            color: 'white',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            MH
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>CampusCare</h2>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="flex items-center gap-4 text-muted" style={{ fontWeight: 500 }}>
                <User size={18} />
                {user.name || user.username} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                <LogOut size={18} style={{ marginRight: '0.4rem' }}/> Logout
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
