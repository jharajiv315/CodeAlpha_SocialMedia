import React, { useState, useEffect, useCallback } from 'react';
import { Build, BuildMilestone, CollaborationRequest, Post } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { BuildHeader } from '../components/builds/BuildHeader';
import { MilestoneTimeline } from '../components/builds/MilestoneTimeline';
import { CollabSection } from '../components/builds/CollabSection';
import { PostCard } from '../components/feed/PostCard';
import { CommentSection } from '../components/feed/CommentSection';
import { AddMilestoneModal } from '../features/builds/AddMilestoneModal';
import { CollabRequestModal } from '../features/builds/CollabRequestModal';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { EditorialText } from '../components/common/EditorialText';
import { showToast } from '../hooks/useToast';
import { BookOpen, Users, Activity, MessageSquare } from 'lucide-react';

interface BuildDetailPageProps {
  slug: string;
  onOpenAuth: () => void;
}

export const BuildDetailPage: React.FC<BuildDetailPageProps> = ({
  slug,
  onOpenAuth
}) => {
  const { profile } = useAuth();
  const { navigate } = useRouter();

  const [build, setBuild] = useState<Build | null>(null);
  const [milestones, setMilestones] = useState<BuildMilestone[]>([]);
  const [updates, setUpdates] = useState<Post[]>([]);
  const [collabRequests, setCollabRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);

  const loadBuildData = useCallback(async () => {
    try {
      const b = await dataService.getBuildBySlug(slug, profile?.id);
      if (b) {
        setBuild(b);
        const [ms, up, reqs] = await Promise.all([
          dataService.getMilestones(b.id),
          dataService.getPosts({ buildId: b.id, currentUserId: profile?.id }),
          dataService.getCollabRequestsForBuild(b.id)
        ]);
        setMilestones(ms);
        setUpdates(up.posts);
        setCollabRequests(reqs);
      }
    } catch {
      // Build load handled
    }
  }, [slug, profile]);

  useEffect(() => {
    let isMounted = true;
    const fetchBuild = async () => {
      setLoading(true);
      try {
        const b = await dataService.getBuildBySlug(slug, profile?.id);
        if (isMounted) {
          if (b) {
            setBuild(b);
            const [ms, up, reqs] = await Promise.all([
              dataService.getMilestones(b.id),
              dataService.getPosts({ buildId: b.id, currentUserId: profile?.id }),
              dataService.getCollabRequestsForBuild(b.id)
            ]);
            if (isMounted) {
              setMilestones(ms);
              setUpdates(up.posts);
              setCollabRequests(reqs);
            }
          } else {
            setBuild(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBuild();
    return () => {
      isMounted = false;
    };
  }, [slug, profile?.id]);

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: '40px', maxWidth: '840px' }}>
        <Skeleton height={180} />
        <div style={{ marginTop: '24px' }}>
          <Skeleton height={260} />
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="page-container" style={{ paddingTop: '80px', textAlign: 'center', maxWidth: '480px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Project Not Found
        </h2>
        <p className="subtext" style={{ marginBottom: '24px' }}>
          The project "{slug}" does not exist or may have been renamed by the author.
        </p>
        <Button variant="primary" onClick={() => navigate('/builds')}>
          Browse All Projects
        </Button>
      </div>
    );
  }

  const isOwner = Boolean(profile && profile.id === build.ownerId);

  const handleAppreciate = async () => {
    if (!profile) {
      onOpenAuth();
      return;
    }
    try {
      const res = await dataService.toggleAppreciation(build.id, 'BUILD', profile.id);
      setBuild({
        ...build,
        isAppreciated: res.isAppreciated,
        appreciationsCount: res.newCount
      });
      showToast(res.isAppreciated ? 'Appreciated project!' : 'Removed appreciation', 'info');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSave = async () => {
    if (!profile) {
      onOpenAuth();
      return;
    }
    try {
      const saved = await dataService.toggleSave(build.id, profile.id);
      setBuild({
        ...build,
        isSaved: saved,
        savesCount: saved ? (build.savesCount || 0) + 1 : Math.max(0, (build.savesCount || 0) - 1)
      });
      showToast(saved ? 'Project bookmarked' : 'Removed from bookmarks', 'info');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleFollow = async () => {
    if (!profile) {
      onOpenAuth();
      return;
    }
    try {
      const res = await dataService.toggleFollowBuild(build.id, profile.id);
      setBuild({
        ...build,
        isFollowing: res.isFollowing,
        followersCount: res.newCount
      });
      showToast(res.isFollowing ? 'Following project updates' : 'Unfollowed project', 'info');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleRespondCollab = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!profile || !isOwner) return;
    try {
      await dataService.respondToCollaboration(requestId, status, profile.id);
      setCollabRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
      showToast(status === 'ACCEPTED' ? 'Collaborator accepted to project!' : 'Application declined', 'info');
      loadBuildData();
    } catch {
      showToast('Failed to update application', 'error');
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '32px', paddingBottom: '96px', maxWidth: '860px' }}>
      {/* 1. Hero Header Banner */}
      <BuildHeader
        build={build}
        isOwner={isOwner}
        onAppreciate={handleAppreciate}
        onSave={handleSave}
        onFollow={handleFollow}
        onOpenCollabModal={() => (profile ? setShowCollabModal(true) : onOpenAuth())}
        onOpenEditModal={() => showToast('Editing configuration is available in project settings', 'info')}
      />

      {/* 2. Deep Dive Architectural Narrative Card */}
      <section className="card" style={{ padding: '28px 32px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
        <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <BookOpen size={13} color="var(--accent-primary)" />
          <span>Architecture & Technical Narrative</span>
        </div>
        <EditorialText
          content={build.description}
          style={{
            fontSize: '15px',
            color: 'var(--text-primary)',
            lineHeight: 1.7
          }}
        />
      </section>

      {/* 3. Longitudinal Milestones Progression */}
      <MilestoneTimeline
        milestones={milestones}
        isOwner={isOwner}
        onAddMilestone={() => setShowAddMilestone(true)}
      />

      {/* 4. Collaboration Opportunities & Team */}
      <CollabSection
        posting={build.collabPosting}
        isOwner={isOwner}
        requests={collabRequests}
        onOpenApplyModal={() => (profile ? setShowCollabModal(true) : onOpenAuth())}
        onRespondRequest={handleRespondCollab}
      />

      {/* 5. Team / Collaborators */}
      {build.collaborators && build.collaborators.length > 0 && (
        <section className="card" style={{ padding: '24px 32px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
          <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <Users size={13} color="var(--accent-primary)" />
            <span>Active Engineering Contributors ({build.collaborators.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {build.collaborators.map((c) => (
              <div
                key={c.id}
                onClick={() => c.userProfile && navigate(`/u/${c.userProfile.username}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar src={c.userProfile?.avatar} name={c.userProfile?.displayName || 'Builder'} size="sm" />
                  <div>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.userProfile?.displayName}
                    </span>
                    <span className="subtext" style={{ fontSize: '12px', marginLeft: '6px' }}>
                      @{c.userProfile?.username}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: 'var(--accent-primary)',
                    backgroundColor: 'var(--accent-primary-muted)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {c.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Updates & Notes Stream */}
      {updates.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <Activity size={13} color="var(--accent-primary)" />
            <span>Project Updates & Changelogs ({updates.length})</span>
          </div>
          <div>
            {updates.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Community Technical Discussion */}
      <section className="card" style={{ padding: '28px 32px', backgroundColor: '#ffffff' }}>
        <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <MessageSquare size={13} color="var(--accent-primary)" />
          <span>Technical Discussion & Code Reviews</span>
        </div>
        <CommentSection targetId={build.id} targetType="BUILD" />
      </section>

      {/* Modals */}
      {showAddMilestone && (
        <AddMilestoneModal
          isOpen={showAddMilestone}
          onClose={() => setShowAddMilestone(false)}
          buildId={build.id}
          onMilestoneAdded={loadBuildData}
        />
      )}

      {showCollabModal && (
        <CollabRequestModal
          isOpen={showCollabModal}
          onClose={() => setShowCollabModal(false)}
          build={build}
          onRequestSubmitted={loadBuildData}
        />
      )}
    </div>
  );
};
