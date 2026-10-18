import React from 'react';

interface EditorialTextProps {
  content: string;
  style?: React.CSSProperties;
  className?: string;
}

export const EditorialText: React.FC<EditorialTextProps> = ({ content, style, className }) => {
  if (!content) return null;

  // Split into paragraphs by double newlines or single newlines
  const paragraphs = content.split(/\n\s*\n/);

  const formatInline = (text: string) => {
    // Match inline code blocks like `code`
    const parts = text.split(/(`[^`]+`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const code = part.slice(1, -1);
        return (
          <code
            key={index}
            className="code-text"
            style={{
              padding: '2px 7px',
              backgroundColor: '#f1f5f9',
              borderRadius: 'var(--radius-xs)',
              fontSize: '12.5px',
              color: '#334155',
              border: '1px solid #e2e8f0',
              fontWeight: 500
            }}
          >
            {code}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '14px', ...style }}>
      {paragraphs.map((p, idx) => (
        <p key={idx} style={{ margin: 0, lineHeight: 1.68 }}>
          {formatInline(p.trim())}
        </p>
      ))}
    </div>
  );
};
