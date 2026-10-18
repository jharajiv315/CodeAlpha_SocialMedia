import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { SEED_PROFILES } from '../../services/seedData';
import { Avatar } from '../../components/common/Avatar';
import { showToast } from '../../hooks/useToast';
import { Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequireOnboarding?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRequireOnboarding
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, switchPersona } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) throw new Error('Please enter your full name');
        await signUpWithEmail(email, password, displayName);
        showToast('Account created successfully! Welcome to FORGE.', 'success');
        if (onRequireOnboarding) onRequireOnboarding();
      } else {
        await signInWithEmail(email, password);
        showToast('Signed in successfully', 'success');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      showToast('Signed in with Google', 'success');
      if (res.isNewUser && onRequireOnboarding) {
        onRequireOnboarding();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = async (profileId: string) => {
    try {
      await switchPersona(profileId);
      showToast('Signed in as demo builder', 'success');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to switch account');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign in to FORGE' : 'Create your FORGE account'}
      subtitle="Connect with active software engineers, share real builds, and collaborate."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Google OAuth Button */}
        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          loading={loading}
          style={{ width: '100%', padding: '10px 14px', justifyContent: 'center' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12.5px',
              color: 'var(--danger-text)',
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="e.g. Rajiv Mehta"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="developer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button variant="primary" type="submit" loading={loading} style={{ width: '100%', marginTop: '6px' }}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {mode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
              >
                Create one
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>

        {/* Quick Testing Personas */}
        <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
            <Sparkles size={12} color="var(--accent-primary)" />
            <span>Explore Instantly with Demo Accounts</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {SEED_PROFILES.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePersonaSelect(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary-muted)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <Avatar src={p.avatar} name={p.displayName} size="xs" />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {p.displayName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    @{p.username}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
