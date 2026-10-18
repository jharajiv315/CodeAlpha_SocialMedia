import React, { useState, useEffect, useCallback } from 'react';
import { Post, Build, UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { PostComposer } from '../components/feed/PostComposer';
import { PostCard } from '../components/feed/PostCard';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { Sparkles, Users, Activity } from 'lucide-react';

interface HomePageProps {
  onOpenAuth: () => void;
  onOpenCreateBuild: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAuth
}) => {
  const { profile, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [builders, setBuilders] = useState<UserProfile[]>([]);
  const [recentBuilds, setRecentBuilds] = useState<Build[]>([]);

  const loadFeed = useCallback(async (reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const currentOffset = reset ? 0 : posts.length;

      let result;
      if (activeTab === 'following' && profile) {
        result = await dataService.getFollowingFeed(profile.id, { limit: 10, offset: currentOffset });
      } else {
        result = await dataService.getPosts({
          limit: 10,
          offset: currentOffset,
          currentUserId: profile?.id
        });
      }

      setPosts((prev) => (reset ? result.posts : [...prev, ...result.posts]));
      setHasMore(result.hasMore);
    } catch {
      // Feed error handled gracefully
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, profile, posts.length]);

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const result = activeTab === 'following' && profile
          ? await dataService.getFollowingFeed(profile.id, { limit: 10, offset: 0 })
          : await dataService.getPosts({ limit: 10, offset: 0, currentUserId: profile?.id });
        if (isMounted) {
          setPosts(result.posts);
          setHasMore(result.hasMore);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, [activeTab, profile]);

  useEffect(() => {
    dataService.getExploreSections().then((res) => {
      setBuilders(res.risingBuilders);
      setRecentBuilds(res.recentlyShipped);
    });
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '28px', paddingBottom: '80px' }}>
      <div className="feed-grid">
        {/* Main Feed Column */}
        <main style={{ minWidth: 0 }}>
          {/* Post Composer */}
          <PostComposer
            onPostCreated={() => loadFeed(true)}
            onOpenAuth={onOpenAuth}
          />

          {/* Interactive Navigation Filter Tabs */}
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
                onClick={() => setActiveTab('all')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  color: activeTab === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === 'all' ? '#ffffff' : 'transparent',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: activeTab === 'all' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Activity size={14} />
                <span>Global Stream</span>
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) onOpenAuth();
                  else setActiveTab('following');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'following' ? 700 : 500,
                  color: activeTab === 'following' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === 'following' ? '#ffffff' : 'transparent',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: activeTab === 'following' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Users size={14} />
                <span>Following</span>
              </button>
            </div>

            <div className="subtext hide-on-mobile" style={{ fontSize: '12px' }}>
              Showing verified engineering updates
            </div>
          </div>

          {/* Stream of Posts */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <Skeleton height={20} width="40%" />
                <div style={{ marginTop: '14px' }}>
                  <Skeleton height={60} />
                </div>
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <Skeleton height={20} width="50%" />
                <div style={{ marginTop: '14px' }}>
                  <Skeleton height={60} />
                </div>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div
              className="card"
              style={{
                padding: '56px 24px',
                textAlign: 'center',
                backgroundColor: '#ffffff'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-primary-muted)',
                  color: 'var(--accent-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {activeTab === 'following' ? 'No updates from your network yet' : 'No posts published yet'}
              </h3>
              <p className="subtext" style={{ maxWidth: '420px', margin: '0 auto 20px' }}>
                {activeTab === 'following'
                  ? 'Follow engineers and software projects to see their ongoing milestones and technical insights here.'
                  : 'Document your technical discoveries or browse active software projects.'}
              </p>
              <Button variant="primary" size="sm" onClick={() => navigate('/explore')}>
                Explore Builders
              </Button>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={(id) => setPosts(posts.filter((p) => p.id !== id))}
                />
              ))}

              {hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 12px' }}>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => loadFeed(false)}
                    loading={loadingMore}
                  >
                    Load More Updates
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Rail Sidebar */}
        <div className="hide-on-mobile">
          <Sidebar builders={builders} activeBuilds={recentBuilds} />
        </div>
      </div>
    </div>
  );
};
