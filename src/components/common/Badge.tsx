import React from 'react';
import { BuildStatus } from '../../types';
import { BUILD_STATUS_CONFIG } from '../../config/constants';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'idea' | 'progress' | 'beta' | 'shipped' | 'archived' | 'neutral' | 'accent' | 'blue';
  status?: BuildStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  className = '',
  size = 'md'
}) => {
  let badgeVariant = variant || 'neutral';
  let label = children;

  if (status && BUILD_STATUS_CONFIG[status]) {
    badgeVariant = BUILD_STATUS_CONFIG[status].variant;
    label = label || BUILD_STATUS_CONFIG[status].label;
  }

  const sizeStyle = size === 'sm' ? { fontSize: '10.5px', padding: '2px 7px' } : {};

  return (
    <span
      className={`badge badge-${badgeVariant} ${className}`}
      style={sizeStyle}
    >
      {label}
    </span>
  );
};
