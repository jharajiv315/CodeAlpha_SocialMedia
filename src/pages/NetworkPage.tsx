import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { Search, Users, MapPin, ArrowRight } from 'lucide-react';
import { showToast } from '../hooks/useToast';

interface NetworkPageProps {
  onOpenAuth: () => void;
}

export const NetworkPage: React.FC<NetworkPageProps> = ({ onOpenAuth }) => {
  const { profile: currentAuthProfile } = useAuth();
  const { navigate } = useRouter();

  const [builders, setBuilders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const exp = await dataService.getExploreSections();
        if (isMounted) {
          setBuilders(exp.risingBuilders);
          if (currentAuthProfile) {
            const map: Record<string, boolean> = {};
            exp.risingBuilders.forEach((b) => {
              map[b.id] = dataService.isFollowingUser(currentAuthProfile.id, b.id);
            });
            setFollowingMap(map);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [currentAuthProfile]);

  const handleFollowToggle = async (targetId: string, username: string) => {
    if (!currentAuthProfile) {
      onOpenAuth();
      return;
    }

    const prev = followingMap[targetId];
    setFollowingMap({ ...followingMap, [targetId]: !prev });

    try {
      const res = await dataService.toggleFollowUser(targetId, currentAuthProfile.id);
      setFollowingMap({ ...followingMap, [targetId]: res.isFollowing });
      showToast(res.isFollowing ? `Now following @${username}` : `Unfollowed @${username}`, 'info');
    } catch {
      setFollowingMap({ ...followingMap, [targetId]: prev });
      showToast('Action failed', 'error');
    }
  };

  const filtered = builders.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.displayName.toLowerCase().includes(q) ||
      b.username.toLowerCase().includes(q) ||
      b.headline.toLowerCase().includes(q) ||
      b.currentlyBuilding?.some((cb) => cb.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-container" style={{ paddingTop: '36px', paddingBottom: '96px', maxWidth: '880px' }}>
      <div style={{ marginBottom: '28px' }}>
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
            <Users size={18} />
          </div>
          <span className="meta-label">Builder Network</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Engineers to Connect With
        </h1>
        <p className="subtext" style={{ fontSize: '15px' }}>
          Builders actively developing systems, shipping milestones, and looking for collaborators.
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#ffffff',
          padding: '10px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '28px'
        }}
      >
        <Search size={16} color="var(--text-tertiary)" />
        <input
          type="text"
          placeholder="Search engineers by name, handle, tech stack, or what they are building..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', fontSize: '13.5px', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      {/* Grid of Builder Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <Skeleton height={180} />
          <Skeleton height={180} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <p className="subtext">No builders matched your search query "{search}".</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '18px'
          }}
        >
          {filtered.map((b) => {
            const isSelf = currentAuthProfile?.id === b.id;
            const isFollowing = followingMap[b.id];

            return (
              <div
                key={b.id}
                className="card card-interactive"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div
                      onClick={() => navigate(`/u/${b.username}`)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <Avatar src={b.avatar} name={b.displayName} size="md" showCollabBadge={b.openToCollaboration} />
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {b.displayName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          @{b.username}
                        </div>
                      </div>
                    </div>

                    {!isSelf && (
                      <Button
                        variant={isFollowing ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleFollowToggle(b.id, b.username)}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {b.headline}
                  </p>

                  {b.currentlyBuilding && b.currentlyBuilding.length > 0 && (
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>Building: </span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{b.currentlyBuilding[0]}</strong>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-hairline)',
                    fontSize: '12px',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  {b.location ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {b.location}
                    </span>
                  ) : (
                    <span>{b.buildsCount || 0} builds</span>
                  )}

                  <button
                    onClick={() => navigate(`/u/${b.username}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--accent-primary)'
                    }}
                  >
                    <span>View Profile</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
