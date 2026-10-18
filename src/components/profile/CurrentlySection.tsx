import React from 'react';
import { UserProfile } from '../../types';
import { Hammer, BookOpen, Compass, Users } from 'lucide-react';

interface CurrentlySectionProps {
  profile: UserProfile;
}

export const CurrentlySection: React.FC<CurrentlySectionProps> = ({ profile }) => {
  return (
    <section className="card" style={{ padding: '28px 32px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div className="meta-label">Engineering Focus & Growth</div>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Active Stacks</div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}
      >
        {/* Building */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Hammer size={12} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Building
            </span>
          </div>
          {profile.currentlyBuilding && profile.currentlyBuilding.length > 0 ? (
            <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.45 }}>
              {profile.currentlyBuilding.join(', ')}
            </div>
          ) : (
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>No current projects specified</span>
          )}
        </div>

        {/* Learning */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookOpen size={12} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Learning
            </span>
          </div>
          {profile.currentlyLearning && profile.currentlyLearning.length > 0 ? (
            <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.45 }}>
              {profile.currentlyLearning.join(', ')}
            </div>
          ) : (
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>No topics specified</span>
          )}
        </div>

        {/* Exploring */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Compass size={12} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Exploring
            </span>
          </div>
          {profile.currentlyExploring && profile.currentlyExploring.length > 0 ? (
            <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.45 }}>
              {profile.currentlyExploring.join(', ')}
            </div>
          ) : (
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>No experiments listed</span>
          )}
        </div>

        {/* Open To Collaboration */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '6px',
                backgroundColor: profile.openToCollaboration ? '#ecfdf5' : '#f1f5f9',
                color: profile.openToCollaboration ? '#059669' : 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={12} />
            </div>
            <span style={{ fontSize: '11px', color: profile.openToCollaboration ? '#059669' : 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {profile.openToCollaboration ? 'Open to Collab' : 'Collaboration'}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.45 }}>
            {profile.openToCollaboration
              ? profile.collaborationPreferences || 'Open to technical pairings & code reviews'
              : 'Focused on solo builds currently'}
          </div>
        </div>
      </div>
    </section>
  );
};
