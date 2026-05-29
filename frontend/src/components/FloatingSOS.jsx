import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Phone, Bot, X } from 'lucide-react';

const FloatingSOS = ({ sid }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerSOS = async () => {
    if (window.confirm("Are you sure you want to trigger an emergency SOS? Campus security and counsellors will be alerted immediately.")) {
      try {
        const res = await axios.post('http://localhost:5000/api/emergency/sos', { sid });
        alert(res.data.message || 'SOS Alert Triggered Successfully.');
        setIsOpen(false);
      } catch (err) {
        alert('Failed to trigger SOS.');
      }
    }
  };

  const handleCallHelpline = () => {
    alert("Calling National Mental Health Helpline: 988");
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {/* Radial Menu Items */}
      <div 
        style={{
          position: 'absolute',
          bottom: '4rem',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-end',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <button 
          onClick={handleCallHelpline}
          className="btn glass-card flex items-center gap-3" 
          style={{ padding: '0.75rem 1.5rem', color: '#34d399', background: 'rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontWeight: 600 }}>Call 988 Helpline</span>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '50%' }}><Phone size={18} /></div>
        </button>

        <button 
          onClick={handleTriggerSOS}
          className="btn glass-card flex items-center gap-3" 
          style={{ padding: '0.75rem 1.5rem', color: '#fb7185', background: 'rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontWeight: 600 }}>Trigger Campus SOS</span>
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '50%' }}><ShieldAlert size={18} /></div>
        </button>
      </div>

      {/* Main FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pulse-soft"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isOpen ? '#64748b' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.1)' : '0 8px 24px rgba(239, 68, 68, 0.4)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        {isOpen ? <X size={28} /> : <ShieldAlert size={28} />}
      </button>
    </div>
  );
};

export default FloatingSOS;
