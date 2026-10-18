import React, { useState, useEffect } from 'react';
import { Comment } from '../../types';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Trash2 } from 'lucide-react';
import { showToast } from '../../hooks/useToast';

interface CommentSectionProps {
  targetId: string;
  targetType: 'POST' | 'BUILD';
  onCommentCountChange?: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  targetId,
  targetType,
  onCommentCountChange
}) => {
  const { profile, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await dataService.getComments(targetId);
        if (isMounted) {
          setComments(res);
          if (onCommentCountChange) {
            onCommentCountChange(res.length);
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
  }, [targetId, onCommentCountChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !profile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await dataService.addComment(targetId, targetType, profile.id, newComment);
      const updated = [...comments, created];
      setComments(updated);
      setNewComment('');
      if (onCommentCountChange) onCommentCountChange(updated.length);
      showToast('Comment posted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!profile) return;
    try {
      await dataService.deleteComment(commentId, profile.id);
      const updated = comments.filter((c) => c.id !== commentId);
      setComments(updated);
      if (onCommentCountChange) onCommentCountChange(updated.length);
      showToast('Comment removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete comment', 'error');
    }
  };

  return (
    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
      {/* Input box */}
      {isAuthenticated && profile ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <Avatar src={profile.avatar} name={profile.displayName} size="xs" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              placeholder="Add your peer review, feedback, or insight..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-base"
              style={{ fontSize: '13px', padding: '8px 12px' }}
            />
            {newComment.trim() && (
              <div style={{ alignSelf: 'flex-end' }}>
                <Button variant="primary" size="sm" loading={isSubmitting} type="submit">
                  Comment
                </Button>
              </div>
            )}
          </div>
        </form>
      ) : (
        <div style={{ fontSize: '12.5px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
          Sign in to join the technical discussion.
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Loading discussion...</div>
      ) : comments.length === 0 ? (
        <div style={{ fontSize: '12.5px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
          No peer comments yet. Share your technical perspective.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '10px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-hairline)',
                fontSize: '13px',
                lineHeight: 1.45
              }}
            >
              <Avatar src={c.author?.avatar} name={c.author?.displayName || 'User'} size="xs" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.author?.displayName || 'Unknown'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      @{c.author?.username}
                    </span>
                  </div>

                  {profile && profile.id === c.authorId && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      title="Delete your comment"
                      style={{ padding: '2px', color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-text)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <p style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
