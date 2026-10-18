import React, { useState, useEffect } from 'react';
import { Build, UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { useRouter } from '../hooks/useRouter';
import { BuildCard } from '../components/builds/BuildCard';
import { Avatar } from '../components/common/Avatar';
import { Skeleton } from '../components/common/Skeleton';
import { POPULAR_TOPICS } from '../config/constants';
import { Compass, ArrowRight } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { navigate } = useRouter();

  const [recentlyShipped, setRecentlyShipped] = useState<Build[]>([]);
  const [openCollabs, setOpenCollabs] = useState<Build[]>([]);
  const [risingBuilders, setRisingBuilders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await dataService.getExploreSections();
        if (isMounted) {
          setRecentlyShipped(res.recentlyShipped);
          setOpenCollabs(res.openCollaborations);
          setRisingBuilders(res.risingBuilders);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '36px', paddingBottom: '96px', maxWidth: '900px' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'var(--accent-primary-muted)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Compass size={18} />
          </div>
          <span className="meta-label">Discovery Hub</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Explore Real Engineering
        </h1>
        <p className="subtext" style={{ fontSize: '15px' }}>
          Software, systems, algorithms, and open source tools built with verifiable source code.
        </p>
      </div>

      {/* Technology Focus Areas Pills Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '36px', backgroundColor: '#ffffff' }}>
        <div className="meta-label" style={{ marginBottom: '12px' }}>
          Browse by technology & focus area
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {POPULAR_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => navigate(`/builds?search=${encodeURIComponent(topic)}`)}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)';
                e.currentTarget.style.backgroundColor = 'var(--accent-primary-muted)';
                e.currentTarget.style.borderColor = 'var(--accent-primary-border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton height={140} />
          <Skeleton height={140} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Section: Open Collaborations */}
          {openCollabs.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <div className="meta-label" style={{ color: '#059669', marginBottom: '4px' }}>
                    Active Teams
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Looking for Collaborators
                  </h2>
                  <p className="subtext">
                    Builders actively looking for co-engineers, designers, or technical reviewers.
                  </p>
                </div>
              </div>

              <div>
                {openCollabs.map((b) => (
                  <BuildCard key={b.id} build={b} />
                ))}
              </div>
            </section>
          )}

          {/* Section: Active Rising Builders Grid */}
          {risingBuilders.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <div className="meta-label" style={{ color: 'var(--accent-amber)', marginBottom: '4px' }}>
                    Community Spotlight
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Builders Shipping Frequently
                  </h2>
                  <p className="subtext">
                    Engineers documenting real progress and sharing source-backed projects.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/network')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>View all builders</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px'
                }}
              >
                {risingBuilders.map((p) => (
                  <div
                    key={p.id}
                    className="card card-interactive"
                    onClick={() => navigate(`/u/${p.username}`)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar src={p.avatar} name={p.displayName} size="md" />
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.displayName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          @{p.username}
                        </div>
                      </div>
                    </div>

                    <p className="subtext" style={{ fontSize: '13px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.headline}
                    </p>

                    {p.currentlyBuilding && p.currentlyBuilding.length > 0 && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          backgroundColor: '#f8fafc',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-hairline)'
                        }}
                      >
                        <span style={{ color: 'var(--text-tertiary)' }}>Building: </span>
                        <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.currentlyBuilding[0]}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Recently Shipped */}
          {recentlyShipped.length > 0 && (
            <section>
              <div style={{ marginBottom: '18px' }}>
                <div className="meta-label" style={{ color: 'var(--status-shipped)', marginBottom: '4px' }}>
                  Milestone Reached
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Recently Shipped Builds
                </h2>
                <p className="subtext">
                  Projects that reached production, beta testing, or public releases.
                </p>
              </div>

              <div>
                {recentlyShipped.map((b) => (
                  <BuildCard key={b.id} build={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
