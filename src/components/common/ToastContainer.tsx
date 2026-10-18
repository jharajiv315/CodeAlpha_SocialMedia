import React, { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { subscribe, toasts } = useToast();

  useEffect(() => {
    return subscribe();
  }, [subscribe]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px'
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isSuccess ? 'rgba(74, 222, 128, 0.4)' : isError ? 'rgba(248, 113, 113, 0.4)' : 'rgba(199, 210, 254, 0.6)'}`,
              boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
              fontSize: '13.5px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="#16a34a" />}
            {isError && <AlertCircle size={18} color="#dc2626" />}
            {!isSuccess && !isError && <Info size={18} color="var(--accent-primary)" />}
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
