import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { Button } from '../components/common/Button';
import { Compass, Home, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div
      className="page-container"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        textAlign: 'center',
        maxWidth: '520px'
      }}
    >
      <div
        className="card"
        style={{
          padding: '48px 32px',
          backgroundColor: '#ffffff'
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            backgroundColor: 'var(--accent-primary-muted)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <HelpCircle size={28} />
        </div>

        <div
          className="font-mono"
          style={{
            fontSize: '52px',
            fontWeight: 800,
            background: 'var(--accent-primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
            letterSpacing: '-0.04em'
          }}
        >
          404
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Page Not Found
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.55 }}>
          The page or project you navigated to does not exist on Forge or has moved to another address.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="secondary" icon={<Compass size={14} />} onClick={() => navigate('/builds')}>
            Browse Projects
          </Button>
          <Button variant="primary" icon={<Home size={14} />} onClick={() => navigate('/')}>
            Return to Feed
          </Button>
        </div>
      </div>
    </div>
  );
};
