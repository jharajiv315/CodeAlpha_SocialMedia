import React, { useState, useEffect } from 'react';
import { PostType, Build } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { showToast } from '../../hooks/useToast';
import { Activity, Code2, HelpCircle, Users, Lightbulb, Send, Terminal } from 'lucide-react';

interface PostComposerProps {
  onPostCreated?: () => void;
  defaultBuildId?: string;
  onOpenAuth?: () => void;
}

const TYPE_OPTIONS: { type: PostType; label: string; icon: React.ReactNode }[] = [
  { type: 'UPDATE', label: 'Update', icon: <Activity size={12} /> },
  { type: 'INSIGHT', label: 'Technical Insight', icon: <Lightbulb size={12} /> },
  { type: 'QUESTION', label: 'Question', icon: <HelpCircle size={12} /> },
  { type: 'COLLAB', label: 'Collaboration', icon: <Users size={12} /> }
];

export const PostComposer: React.FC<PostComposerProps> = ({
  onPostCreated,
  defaultBuildId,
  onOpenAuth
}) => {
  const { profile, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('UPDATE');
  const [selectedBuildId, setSelectedBuildId] = useState<string>(defaultBuildId || '');
  const [userBuilds, setUserBuilds] = useState<Build[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      dataService.getBuilds({ ownerId: profile.id }).then(setUserBuilds);
    }
  }, [profile]);

  if (!isAuthenticated || !profile) {
    return (
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)'
            }}
          >
            <Terminal size={18} />
          </div>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Showcase what you are building
            </div>
            <div className="subtext" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Join engineers sharing verifiable progress, architecture breakthroughs, and tools.
            </div>
          </div>
        </div>

        {onOpenAuth && (
          <Button variant="primary" size="sm" onClick={onOpenAuth}>
            Sign In to Share
          </Button>
        )}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dataService.createPost({
        authorId: profile.id,
        buildId: selectedBuildId || undefined,
        type: selectedType,
        title: title.trim() || undefined,
        content: content.trim()
      });

      setTitle('');
      setContent('');
      setIsExpanded(false);
      showToast('Update shared with the builder community!', 'success');
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      showToast(err.message || 'Failed to post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '20px',
        marginBottom: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.9)'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Avatar src={profile.avatar} name={profile.displayName} size="md" />

          <div style={{ flex: 1 }}>
            {/* Quick Post Type Selector Pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {TYPE_OPTIONS.map((opt) => {
                const isActive = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setSelectedType(opt.type);
                      setIsExpanded(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11.5px',
                      fontWeight: isActive ? 600 : 500,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? '#0f172a' : '#f8fafc',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      border: isActive ? '1px solid #0f172a' : '1px solid var(--border-subtle)',
                      boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.12)' : 'none',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Optional Title when expanded */}
            {isExpanded && (
              <input
                type="text"
                placeholder="Headline (e.g. Switched checkout lock from rows to advisory locks)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--border-hairline)',
                  outline: 'none'
                }}
              />
            )}

            {/* Core Text Input */}
            <textarea
              placeholder="What did you build, fix, or learn today? Code snippets with `backticks` supported..."
              value={content}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setContent(e.target.value)}
              rows={isExpanded ? 3 : 2}
              style={{
                width: '100%',
                fontSize: '14px',
                color: 'var(--text-primary)',
                resize: 'none',
                lineHeight: 1.6,
                outline: 'none',
                border: 'none',
                background: 'transparent'
              }}
            />

            {/* Expanded Controls Bar */}
            {isExpanded && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-hairline)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Associated Build Selector */}
                  {userBuilds.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Code2 size={14} color="var(--text-tertiary)" />
                      <select
                        value={selectedBuildId}
                        onChange={(e) => setSelectedBuildId(e.target.value)}
                        className="input-base"
                        style={{ width: 'auto', padding: '4px 10px', fontSize: '12px' }}
                      >
                        <option value="">Attach project (optional)...</option>
                        {userBuilds.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!content.trim()}
                    icon={<Send size={13} />}
                  >
                    Publish
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
