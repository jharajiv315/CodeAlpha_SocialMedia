import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCollabBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 26,
  sm: 34,
  md: 42,
  lg: 58,
  xl: 88
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  showCollabBadge = false,
  className = '',
  onClick
}) => {
  const pixelSize = SIZE_MAP[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{ width: pixelSize, height: pixelSize, flexShrink: 0, position: 'relative' }}
    >
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#e0e7ff',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
          border: '1.5px solid #ffffff',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: pixelSize * 0.38,
          fontWeight: 700,
          color: 'var(--accent-primary)'
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {showCollabBadge && (
        <span
          title="Open to Collaboration"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: Math.max(9, pixelSize * 0.28),
            height: Math.max(9, pixelSize * 0.28),
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            border: '2px solid #ffffff',
            boxSizing: 'content-box',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}
        />
      )}
    </div>
  );
};
