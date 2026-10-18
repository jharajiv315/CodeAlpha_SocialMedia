import React, { useState } from 'react';
import { Post } from '../../types';
import { Avatar } from '../common/Avatar';
import { EditorialText } from '../common/EditorialText';
import { CommentSection } from './CommentSection';
import { useRouter } from '../../hooks/useRouter';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { showToast } from '../../hooks/useToast';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Trash2,
  ArrowRight,
  Code2
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostDeleted }) => {
  const { profile } = useAuth();
  const { navigate } = useRouter();

  const [isAppreciated, setIsAppreciated] = useState(post.isAppreciated || false);
  const [appreciationsCount, setAppreciationsCount] = useState(post.appreciationsCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isAuthor = profile && profile.id === post.authorId;

  // Type label & badge colors
  const getTypeBadge = () => {
    switch (post.type) {
      case 'BUILD':
        return { label: 'New Project', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'MILESTONE':
        return { label: 'Milestone Achieved', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      case 'INSIGHT':
        return { label: 'Technical Insight', bg: '#faf5ff', color: '#7c3aed', border: '#e9d5ff' };
      case 'QUESTION':
        return { label: 'Question', bg: '#fefce8', color: '#ca8a04', border: '#fef08a' };
      case 'COLLAB':
        return { label: 'Collaboration Call', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
      default:
        return { label: 'Engineering Update', bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  const badge = getTypeBadge();

  const handleToggleAppreciate = async () => {
    if (!profile) {
      showToast('Please sign in to appreciate work', 'info');
      return;
    }
    if (isUpdating) return;

    const prevAppreciated = isAppreciated;
    const prevCount = appreciationsCount;
    setIsAppreciated(!prevAppreciated);
    setAppreciationsCount(prevAppreciated ? prevCount - 1 : prevCount + 1);
    setIsUpdating(true);

    try {
      const res = await dataService.toggleAppreciation(post.id, 'POST', profile.id);
      setIsAppreciated(res.isAppreciated);
      setAppreciationsCount(res.newCount);
    } catch {
      setIsAppreciated(prevAppreciated);
      setAppreciationsCount(prevCount);
      showToast('Could not save appreciation', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSave = async () => {
    if (!profile) {
      showToast('Please sign in to save', 'info');
      return;
    }
    const prevSaved = isSaved;
    setIsSaved(!prevSaved);
    try {
      const saved = await dataService.toggleSave(post.id, profile.id);
      setIsSaved(saved);
      showToast(saved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
    } catch {
      setIsSaved(prevSaved);
    }
  };

  const handleDelete = async () => {
    if (!profile || !isAuthor) return;
    if (!window.confirm('Delete this update?')) return;

    try {
      await dataService.deletePost(post.id, profile.id);
      showToast('Update removed', 'info');
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/?post=${post.id}`);
      showToast('Post link copied to clipboard', 'info');
    }
  };

  return (
    <article
      className="card card-interactive"
      style={{
        padding: '24px',
        marginBottom: '20px',
        position: 'relative'
      }}
    >
      {/* 1. Header: Author Identity + Category Tag */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => post.author && navigate(`/u/${post.author.username}`)}
            style={{ cursor: 'pointer' }}
          >
            <Avatar src={post.author?.avatar} name={post.author?.displayName || 'User'} size="md" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                onClick={() => post.author && navigate(`/u/${post.author.username}`)}
                style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              >
                {post.author?.displayName}
              </span>

              <span style={{ fontSize: '12.5px', color: 'var(--text-tertiary)' }}>
                @{post.author?.username}
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`
                }}
              >
                {badge.label}
              </span>
            </div>

            <div className="subtext" style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {post.author?.headline}
            </div>
          </div>
        </div>

        {isAuthor && (
          <button
            onClick={handleDelete}
            title="Delete update"
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
              e.currentTarget.style.color = 'var(--danger-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* 2. Opening Headline / Statement */}
      {post.title && (
        <h3
          style={{
            fontSize: '17.5px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.35,
            marginBottom: '10px'
          }}
        >
          {post.title}
        </h3>
      )}

      {/* 3. The Work / Body Prose */}
      <EditorialText
        content={post.content}
        style={{
          fontSize: '14.5px',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          lineHeight: 1.65
        }}
      />

      {/* 4. Associated Build Reference Card (Clean clickable banner) */}
      {post.build && (
        <div
          onClick={() => navigate(`/builds/${post.build?.slug}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary-muted)';
            e.currentTarget.style.borderColor = 'var(--accent-primary-border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Working on project: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{post.build.title}</strong>
            </span>
          </div>
          <ArrowRight size={14} color="var(--accent-primary)" />
        </div>
      )}

      {/* 5. Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-hairline)',
          fontSize: '12.5px',
          color: 'var(--text-tertiary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Appreciate */}
          <button
            onClick={handleToggleAppreciate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isAppreciated ? '#e11d48' : 'var(--text-secondary)',
              fontWeight: isAppreciated ? 600 : 500,
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isAppreciated ? '#ffe4e6' : 'transparent',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isAppreciated) e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              if (!isAppreciated) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Heart size={16} fill={isAppreciated ? 'currentColor' : 'none'} />
            <span>{appreciationsCount > 0 ? appreciationsCount : 'Appreciate'}</span>
          </button>

          {/* Discuss */}
          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: showComments ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: showComments ? 600 : 500,
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showComments ? 'var(--accent-primary-muted)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!showComments) e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              if (!showComments) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MessageSquare size={16} />
            <span>{commentsCount > 0 ? `${commentsCount} comments` : 'Discuss'}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleSave}
            title={isSaved ? 'Bookmarked' : 'Bookmark update'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isSaved ? 'var(--accent-primary)' : 'var(--text-secondary)',
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <button
          onClick={handleShare}
          title="Share update"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            padding: '5px 8px',
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>
      </div>

      {/* 6. Embedded Comment Section */}
      {showComments && (
        <CommentSection
          targetId={post.id}
          targetType="POST"
          onCommentCountChange={(count) => setCommentsCount(count)}
        />
      )}
    </article>
  );
};
