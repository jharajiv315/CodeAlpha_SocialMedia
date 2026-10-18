import React from 'react';
import { UserProfile } from '../../types';
import { Hammer, BookOpen, Compass, Users } from 'lucide-react';

interface CurrentlySectionProps {
  profile: UserProfile;
}

export const CurrentlySection: React.FC<CurrentlySectionProps> = ({ profile }) => {
  return (
    <section className="card" style={{ padding: '24px 28px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
      <div className="meta-label" style={{ marginBottom: '16px' }}>
        Engineering Focus & Growth
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Building */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#1d4ed8', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Hammer size={13} />
            <span>Building</span>
          </div>
          {profile.currentlyBuilding && profile.currentlyBuilding.length > 0 ? (
            <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600, lineHeight: 1.45 }}>
              {profile.currentlyBuilding.join(', ')}
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>No current projects specified</span>
          )}
        </div>

        {/* Learning */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#7e22ce', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
            <BookOpen size={13} />
            <span>Learning</span>
          </div>
          {profile.currentlyLearning && profile.currentlyLearning.length > 0 ? (
            <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600, lineHeight: 1.45 }}>
              {profile.currentlyLearning.join(', ')}
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>No topics specified</span>
          )}
        </div>

        {/* Exploring */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#fefce8',
            border: '1px solid #fef08a',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#a16207', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Compass size={13} />
            <span>Exploring</span>
          </div>
          {profile.currentlyExploring && profile.currentlyExploring.length > 0 ? (
            <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600, lineHeight: 1.45 }}>
              {profile.currentlyExploring.join(', ')}
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>No experiments listed</span>
          )}
        </div>

        {/* Open To Collaboration */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#15803d', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Users size={13} />
            <span>Collaboration</span>
          </div>
          <div style={{ fontSize: '13.5px', color: '#166534', fontWeight: 500, lineHeight: 1.45 }}>
            {profile.openToCollaboration
              ? profile.collaborationPreferences || 'Open to technical pairings & code reviews'
              : 'Focused on solo builds currently'}
          </div>
        </div>
      </div>
    </section>
  );
};
