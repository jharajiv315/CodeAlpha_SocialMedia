import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${className}`}
        style={error ? { borderColor: 'var(--danger-border)', backgroundColor: 'var(--danger-bg)' } : {}}
        {...props}
      />
      {hint && !error && (
        <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: '11.5px', color: 'var(--danger-text)', fontWeight: 500 }}>{error}</span>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  hint,
  error,
  id,
  className = '',
  rows = 3,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`input-field ${className}`}
        rows={rows}
        style={{
          resize: 'vertical',
          ...(error ? { borderColor: 'var(--danger-border)', backgroundColor: 'var(--danger-bg)' } : {})
        }}
        {...props}
      />
      {hint && !error && (
        <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: '11.5px', color: 'var(--danger-text)', fontWeight: 500 }}>{error}</span>
      )}
    </div>
  );
};
