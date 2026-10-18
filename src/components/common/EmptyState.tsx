import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '56px 28px',
        border: '1.5px dashed var(--border-subtle)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 'var(--radius-lg)',
        margin: '20px 0'
      }}
    >
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            backgroundColor: 'var(--accent-primary-muted)',
            color: 'var(--accent-primary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.55 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <div style={{ marginTop: '20px' }}>
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
