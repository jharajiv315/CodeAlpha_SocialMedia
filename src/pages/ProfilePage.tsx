import React, { useState, useEffect } from 'react';
import { UserProfile, Build, Post } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { CurrentlySection } from '../components/profile/CurrentlySection';
import { BuildCard } from '../components/builds/BuildCard';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { Layers, Activity, Plus } from 'lucide-react';

interface ProfilePageProps {
  username: string;
  onOpenAuth: () => void;
  onOpenCreateBuild: () => void;
  onOpenEditProfile: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  username,
  onOpenAuth,
  onOpenCreateBuild,
  onOpenEditProfile
}) => {
  const { profile: currentAuthProfile } = useAuth();
  const { navigate } = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builds' | 'activity'>('builds');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const p = await dataService.getProfileByUsername(username);
        if (isMounted) {
          if (p) {
            setProfile(p);
            const [bList, pList] = await Promise.all([
              dataService.getBuilds({
                ownerId: p.id,
                currentUserId: currentAuthProfile?.id
              }),
              dataService.getPosts({
                authorId: p.id,
                currentUserId: currentAuthProfile?.id
              })
            ]);
            if (isMounted) {
              setBuilds(bList);
              setPosts(pList.posts);
            }
          } else {
            setProfile(null);
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
  }, [username, currentAuthProfile]);

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: '40px', maxWidth: '860px' }}>
        <Skeleton height={180} />
        <div style={{ marginTop: '24px' }}>
          <Skeleton height={120} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container" style={{ paddingTop: '80px', textAlign: 'center', maxWidth: '480px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Builder Not Found
        </h2>
        <p className="subtext" style={{ marginBottom: '24px' }}>
          No profile exists under @{username}. They may have moved or changed their handle.
        </p>
        <Button variant="primary" onClick={() => navigate('/explore')}>
          Explore Builders
        </Button>
      </div>
    );
  }

  const isOwnProfile = Boolean(currentAuthProfile && currentAuthProfile.id === profile.id);

  return (
    <div className="page-container" style={{ paddingTop: '36px', paddingBottom: '96px', maxWidth: '860px' }}>
      {/* 1. Header (Identity, Headline, Links) */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onOpenEditModal={onOpenEditProfile}
        onOpenAuth={onOpenAuth}
      />

      {/* 2. Living Context: Currently Building & Learning */}
      <CurrentlySection profile={profile} />

      {/* 3. Interactive Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            gap: '4px'
          }}
        >
          <button
            onClick={() => setActiveTab('builds')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: activeTab === 'builds' ? 700 : 500,
              color: activeTab === 'builds' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'builds' ? '#ffffff' : 'transparent',
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              boxShadow: activeTab === 'builds' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={14} />
            <span>Projects ({builds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: activeTab === 'activity' ? 700 : 500,
              color: activeTab === 'activity' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'activity' ? '#ffffff' : 'transparent',
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              boxShadow: activeTab === 'activity' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={14} />
            <span>Updates & Notes ({posts.length})</span>
          </button>
        </div>

        {isOwnProfile && activeTab === 'builds' && (
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onOpenCreateBuild}>
            Start New Project
          </Button>
        )}
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'builds' ? (
        builds.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '56px 24px',
              textAlign: 'center',
              backgroundColor: '#ffffff'
            }}
          >
            <p className="subtext" style={{ marginBottom: '20px' }}>
              {isOwnProfile ? 'Your first project becomes your proof of work.' : 'No public projects published yet.'}
            </p>
            {isOwnProfile && (
              <Button variant="primary" size="sm" onClick={onOpenCreateBuild}>
                Start First Project
              </Button>
            )}
          </div>
        ) : (
          <div>
            {builds.map((b) => (
              <BuildCard key={b.id} build={b} />
            ))}
          </div>
        )
      ) : posts.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <p className="subtext">No engineering notes or updates published yet.</p>
        </div>
      ) : (
        <div>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
};
