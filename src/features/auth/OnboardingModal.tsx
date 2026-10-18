import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../hooks/useToast';
import { VALIDATION } from '../../config/constants';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { session, createInitialProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(session?.displayName || '');
  const [headline, setHeadline] = useState('');
  const [currentlyBuilding, setCurrentlyBuilding] = useState('');
  const [currentlyLearning, setCurrentlyLearning] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    if (!VALIDATION.USERNAME_REGEX.test(cleanUsername)) {
      setError(`Username must be ${VALIDATION.USERNAME_RULES}`);
      return;
    }

    if (!headline.trim()) {
      setError('Please add a technical headline (e.g. Distributed Systems Engineer)');
      return;
    }

    setLoading(true);
    try {
      await createInitialProfile({
        username: cleanUsername,
        displayName: displayName.trim() || cleanUsername,
        headline: headline.trim(),
        currentlyBuilding: currentlyBuilding ? [currentlyBuilding.trim()] : [],
        currentlyLearning: currentlyLearning ? [currentlyLearning.trim()] : []
      });
      showToast('Profile created! Welcome to Forge.', 'success');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Your Professional Profile"
      subtitle="FORGE is built on proof of work. Tell other engineers what you are building and learning."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {error && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '12.5px',
              color: 'var(--danger-text)'
            }}
          >
            {error}
          </div>
        )}

        <Input
          label="Unique Username"
          placeholder="e.g. rajiv_systems"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          hint={VALIDATION.USERNAME_RULES}
          required
        />

        <Input
          label="Display Name"
          placeholder="e.g. Rajiv Mehta"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <Input
          label="Headline"
          placeholder="e.g. Distributed Systems & High-Throughput Databases"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          hint="What is your primary engineering focus or specialty?"
          required
        />

        <Input
          label="What are you currently building?"
          placeholder="e.g. ChronoCache (Multi-Tier Storage Engine)"
          value={currentlyBuilding}
          onChange={(e) => setCurrentlyBuilding(e.target.value)}
        />

        <Input
          label="What are you currently learning or exploring?"
          placeholder="e.g. io_uring kernel async I/O"
          value={currentlyLearning}
          onChange={(e) => setCurrentlyLearning(e.target.value)}
        />

        <Button variant="primary" type="submit" loading={loading} style={{ width: '100%', marginTop: '8px' }}>
          Enter Forge
        </Button>
      </form>
    </Modal>
  );
};
