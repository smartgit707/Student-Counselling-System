import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div className="container animate-fade-in">
      <div className="text-center" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Your Mental Health Matters
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Connect with professional counsellors, track your mental well-being, and take the first step towards a healthier campus life.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
          Get Started Today
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ background: '#E0E7FF', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Calendar size={32} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>Easy Scheduling</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Book appointments with expert counsellors seamlessly.
          </p>
        </div>

        <div className="card text-center" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ background: '#D1FAE5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Activity size={32} color="var(--secondary-color)" />
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>Mental Assessments</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Take quick assessments to understand your stress and anxiety levels.
          </p>
        </div>

        <div className="card text-center" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ background: '#FCE7F3', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Heart size={32} color="#DB2777" />
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>Safe & Confidential</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Your records and sessions are completely private and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
