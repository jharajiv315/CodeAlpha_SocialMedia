import React from 'react';
import { useRouter } from '../../hooks/useRouter';
import { useAuth } from '../../hooks/useAuth';
import { Activity, Compass, Layers, User, Plus } from 'lucide-react';

interface MobileNavProps {
  onOpenCreateBuild: () => void;
  onOpenAuth: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOpenCreateBuild,
  onOpenAuth
}) => {
  const { path, navigate } = useRouter();
  const { profile, isAuthenticated } = useAuth();

  return (
    <nav
      className="hide-on-desktop"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(226, 232, 240, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.04)'
      }}
    >
      <button
        onClick={() => navigate('/')}
        aria-label="Feed"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: path === '/' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          fontSize: '11px',
          fontWeight: path === '/' ? 600 : 500
        }}
      >
        <Activity size={19} />
        <span>Feed</span>
      </button>

      <button
        onClick={() => navigate('/explore')}
        aria-label="Explore"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: path === '/explore' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          fontSize: '11px',
          fontWeight: path === '/explore' ? 600 : 500
        }}
      >
        <Compass size={19} />
        <span>Explore</span>
      </button>

      {/* Floating Create Button */}
      <button
        onClick={() => (isAuthenticated ? onOpenCreateBuild() : onOpenAuth())}
        aria-label="Create Build"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--accent-primary-gradient)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-16px',
          boxShadow: '0 6px 18px rgba(79, 70, 229, 0.38)',
          border: '2px solid #ffffff'
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => navigate('/builds')}
        aria-label="Builds"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: path === '/builds' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          fontSize: '11px',
          fontWeight: path === '/builds' ? 600 : 500
        }}
      >
        <Layers size={19} />
        <span>Builds</span>
      </button>

      <button
        onClick={() => {
          if (isAuthenticated && profile) {
            navigate(`/u/${profile.username}`);
          } else {
            onOpenAuth();
          }
        }}
        aria-label="Profile"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: path.startsWith('/u/') ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          fontSize: '11px',
          fontWeight: path.startsWith('/u/') ? 600 : 500
        }}
      >
        <User size={19} />
        <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
      </button>
    </nav>
  );
};
