import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from '../../hooks/useRouter';
import { Avatar } from '../common/Avatar';
import { UserProfile, Build } from '../../types';
import { POPULAR_TOPICS } from '../../config/constants';
import { ArrowRight, Compass, Flame, TrendingUp } from 'lucide-react';

interface SidebarProps {
  builders?: UserProfile[];
  activeBuilds?: Build[];
}

export const Sidebar: React.FC<SidebarProps> = ({ builders = [], activeBuilds = [] }) => {
  const { profile, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Current Active Context (When logged in) */}
      {isAuthenticated && profile && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={12} color="var(--accent-primary)" />
            <span>Your Active Focus</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar src={profile.avatar} name={profile.displayName} size="sm" />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {profile.displayName}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                @{profile.username}
              </div>
            </div>
          </div>

          {profile.currentlyBuilding && profile.currentlyBuilding.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--accent-primary-muted)',
                border: '1px solid var(--accent-primary-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '2px' }}>
                Currently Building
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {profile.currentlyBuilding[0]}
              </span>
            </div>
          )}

          <button
            onClick={() => navigate(`/u/${profile.username}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}
          >
            <span>View Public Profile</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Featured Builders */}
      {builders.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={13} color="var(--accent-amber)" />
              <span>Builders to Follow</span>
            </div>
            <button
              onClick={() => navigate('/network')}
              style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-primary)' }}
            >
              See all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {builders.slice(0, 3).map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/u/${b.username}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Avatar src={b.avatar} name={b.displayName} size="sm" />
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.displayName}
                  </div>
                  <div className="subtext" style={{ fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.headline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Projects */}
      {activeBuilds.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}
          >
            <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={13} color="var(--accent-primary)" />
              <span>Featured Builds</span>
            </div>
            <button
              onClick={() => navigate('/builds')}
              style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-primary)' }}
            >
              Explore
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeBuilds.slice(0, 3).map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/builds/${b.slug}`)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {b.title}
                </div>
                <div className="subtext" style={{ fontSize: '11.5px', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Engineering Topics */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="meta-label" style={{ marginBottom: '12px' }}>
          Trending Topics
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {POPULAR_TOPICS.slice(0, 8).map((topic) => (
            <button
              key={topic}
              onClick={() => navigate(`/builds?search=${encodeURIComponent(topic)}`)}
              style={{
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                backgroundColor: '#f1f5f9',
                border: '1px solid var(--border-subtle)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 500,
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary-muted)';
                e.currentTarget.style.borderColor = 'var(--accent-primary-border)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
