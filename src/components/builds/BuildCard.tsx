import React from 'react';
import { Build } from '../../types';
import { Avatar } from '../common/Avatar';
import { useRouter } from '../../hooks/useRouter';
import { GithubIcon } from '../common/Icons';
import { ExternalLink, Heart, Users } from 'lucide-react';

interface BuildCardProps {
  build: Build;
  onAppreciate?: (buildId: string) => void;
  compact?: boolean;
}

export const BuildCard: React.FC<BuildCardProps> = ({
  build,
  onAppreciate
}) => {
  const { navigate } = useRouter();

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

  return (
    <article
      className="card card-interactive"
      onClick={() => navigate(`/builds/${build.slug}`)}
      style={{
        padding: '24px',
        marginBottom: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative'
      }}
    >
      {/* Top Meta Line: Status Pill · Category · Collab Alert */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: status.bg,
              color: status.color,
              border: `1px solid ${status.border}`
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: status.dot
              }}
            />
            <span>{status.label}</span>
          </span>

          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              backgroundColor: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {build.category}
          </span>
        </div>

        {build.collabPosting?.isOpen && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              color: '#059669',
              fontWeight: 600,
              backgroundColor: '#ecfdf5',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #a7f3d0'
            }}
          >
            <Users size={12} />
            <span>Seeking Collaborators</span>
          </span>
        )}
      </div>

      {/* Project Title */}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.3
        }}
      >
        {build.title}
      </h3>

      {/* Project Summary */}
      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          margin: 0
        }}
      >
        {build.summary}
      </p>

      {/* Tech Stack Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
        {build.technologies.slice(0, 5).map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '11.5px',
              fontFamily: 'var(--font-mono)',
              color: '#334155',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '2px 7px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 500
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Footer: Creator & Proof Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '6px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-hairline)',
          fontSize: '12.5px',
          color: 'var(--text-tertiary)'
        }}
      >
        {build.owner && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/u/${build.owner?.username}`);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Avatar src={build.owner.avatar} name={build.owner.displayName} size="xs" />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{build.owner.displayName}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {build.proof?.liveDemoUrl && (
            <span
              title="Live Demo Available"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--accent-primary)',
                fontWeight: 500
              }}
            >
              <ExternalLink size={13} />
              <span>Demo</span>
            </span>
          )}

          {build.proof?.githubUrl && (
            <span
              title="Open Source Repository"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              <GithubIcon size={13} />
              <span>Source</span>
            </span>
          )}

          <span
            onClick={(e) => {
              if (onAppreciate) {
                e.stopPropagation();
                onAppreciate(build.id);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: build.isAppreciated ? '#e11d48' : 'var(--text-tertiary)',
              fontWeight: build.isAppreciated ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            <Heart size={14} fill={build.isAppreciated ? 'currentColor' : 'none'} />
            <span>{build.appreciationsCount || ''}</span>
          </span>
        </div>
      </div>
    </article>
  );
};
