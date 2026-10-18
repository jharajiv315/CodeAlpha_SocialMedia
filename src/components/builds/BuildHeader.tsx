import React from 'react';
import { Build } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useRouter } from '../../hooks/useRouter';
import { GithubIcon } from '../common/Icons';
import { sanitizeUrl } from '../../utils/security';
import { ExternalLink, BookOpen, Heart, Bookmark, Share2, Users } from 'lucide-react';
import { showToast } from '../../hooks/useToast';

interface BuildHeaderProps {
  build: Build;
  isOwner: boolean;
  onAppreciate: () => void;
  onSave: () => void;
  onFollow: () => void;
  onOpenCollabModal: () => void;
  onOpenEditModal: () => void;
}

export const BuildHeader: React.FC<BuildHeaderProps> = ({
  build,
  isOwner,
  onAppreciate,
  onSave,
  onFollow,
  onOpenCollabModal,
  onOpenEditModal
}) => {
  const { navigate } = useRouter();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Project link copied to clipboard', 'info');
    }
  };

  const getStatusBadge = () => {
    switch (build.status) {
      case 'SHIPPED':
        return { label: 'Shipped', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', dot: 'var(--status-shipped)' };
      case 'BETA':
        return { label: 'In Beta', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', dot: 'var(--status-beta)' };
      case 'IN_PROGRESS':
        return { label: 'In Progress', bg: '#fefce8', color: '#ca8a04', border: '#fef08a', dot: 'var(--status-progress)' };
      default:
        return { label: 'Concept', bg: '#faf5ff', color: '#7c3aed', border: '#e9d5ff', dot: 'var(--status-idea)' };
    }
  };

  const status = getStatusBadge();
  const demoUrl = sanitizeUrl(build.proof?.liveDemoUrl);
  const githubUrl = sanitizeUrl(build.proof?.githubUrl);
  const docUrl = sanitizeUrl(build.proof?.documentationUrl);

  return (
    <header
      className="card"
      style={{
        padding: '32px 36px',
        marginBottom: '28px',
        backgroundColor: '#ffffff'
      }}
    >
      {/* 1. Context Line: Category · Status · Owner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: status.bg,
              color: status.color,
              border: `1px solid ${status.border}`
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: status.dot
              }}
            />
            <span>{status.label}</span>
          </span>

          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              backgroundColor: '#f1f5f9',
              padding: '3px 10px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {build.category}
          </span>

          {build.collabPosting?.isOpen && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #a7f3d0'
              }}
            >
              <Users size={12} />
              <span>Looking for Collaborators</span>
            </span>
          )}
        </div>

        {build.owner && (
          <div
            onClick={() => navigate(`/u/${build.owner?.username}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Avatar src={build.owner.avatar} name={build.owner.displayName} size="xs" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Built by <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{build.owner.displayName}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 2. Main Title */}
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.25,
          marginBottom: '12px'
        }}
      >
        {build.title}
      </h1>

      {/* 3. Summary */}
      <p
        style={{
          fontSize: '15.5px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '740px',
          marginBottom: '20px'
        }}
      >
        {build.summary}
      </p>

      {/* 4. Technology Stack */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
        {build.technologies.map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: '#334155',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '3px 9px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 500
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* 5. Primary Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-hairline)'
        }}
      >
        {/* Working Proof Links */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn ${!demoUrl ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              <GithubIcon size={14} /> Source Code
            </a>
          )}

          {docUrl && (
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <BookOpen size={14} /> Docs
            </a>
          )}

          {build.collabPosting?.isOpen && !isOwner && (
            <Button variant="secondary" size="sm" onClick={onOpenCollabModal}>
              Collaborate
            </Button>
          )}

          {isOwner && (
            <Button variant="secondary" size="sm" onClick={onOpenEditModal}>
              Edit Build
            </Button>
          )}
        </div>

        {/* Engagement & Sharing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isOwner && (
            <button
              onClick={onFollow}
              className={`btn ${build.isFollowing ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
            >
              {build.isFollowing ? 'Following' : 'Follow Project'}
            </button>
          )}

          <button
            onClick={onAppreciate}
            className="btn btn-ghost btn-sm"
            style={{
              color: build.isAppreciated ? '#e11d48' : 'var(--text-secondary)',
              padding: '7px 10px',
              backgroundColor: build.isAppreciated ? '#ffe4e6' : 'transparent'
            }}
            title="Appreciate"
          >
            <Heart size={16} fill={build.isAppreciated ? 'currentColor' : 'none'} />
            <span style={{ marginLeft: '4px', fontWeight: 600 }}>{build.appreciationsCount || ''}</span>
          </button>

          <button
            onClick={onSave}
            className="btn btn-ghost btn-sm"
            style={{
              color: build.isSaved ? 'var(--accent-primary)' : 'var(--text-secondary)',
              padding: '7px 10px'
            }}
            title="Save to bookmarks"
          >
            <Bookmark size={16} fill={build.isSaved ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            className="btn btn-ghost btn-sm"
            style={{ padding: '7px 10px' }}
            title="Share"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
