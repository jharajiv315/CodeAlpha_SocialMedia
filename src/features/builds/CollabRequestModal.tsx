import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { sanitizeUrl } from '../../utils/security';
import { Build } from '../../types';
import { showToast } from '../../hooks/useToast';

interface CollabRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  build: Build;
  onRequestSubmitted?: () => void;
}

export const CollabRequestModal: React.FC<CollabRequestModalProps> = ({
  isOpen,
  onClose,
  build,
  onRequestSubmitted
}) => {
  const { profile } = useAuth();
  const [roleApplied, setRoleApplied] = useState(
    build.collabPosting?.rolesNeeded?.[0] || 'Frontend Developer'
  );
  const [message, setMessage] = useState('');
  const [proofLinks, setProofLinks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError('');

    if (!message.trim()) {
      setError('Please provide a message explaining how you can contribute.');
      return;
    }

    setLoading(true);
    try {
      const links = proofLinks
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => sanitizeUrl(l))
        .filter((l): l is string => Boolean(l));

      await dataService.requestCollaboration({
        buildId: build.id,
        applicantId: profile.id,
        roleApplied,
        message: message.trim(),
        proofLinks: links
      });

      showToast('Collaboration application sent to project owner!', 'success');
      onClose();
      if (onRequestSubmitted) onRequestSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to Collaborate: ${build.title}`}
      subtitle="Connect with the creator through your relevant proof of work and engineering experience."
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

        {build.collabPosting?.rolesNeeded && build.collabPosting.rolesNeeded.length > 0 ? (
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Role You Are Applying For
            </label>
            <select
              value={roleApplied}
              onChange={(e) => setRoleApplied(e.target.value)}
              className="input-base"
              style={{ padding: '8px 10px' }}
            >
              {build.collabPosting.rolesNeeded.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Input
            label="Role You Wish to Contribute"
            placeholder="e.g. Backend Go Engineer or UI Designer"
            value={roleApplied}
            onChange={(e) => setRoleApplied(e.target.value)}
            required
          />
        )}

        <TextArea
          label="Why this project & what will you build?"
          placeholder="Describe your relevant experience, technical background, and how you plan to tackle this project..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />

        <Input
          label="Proof of Work / Past Project Links"
          placeholder="GitHub repo URL, PR link, or live project URL (Comma-separated)"
          value={proofLinks}
          onChange={(e) => setProofLinks(e.target.value)}
          hint="Evidence of your skills dramatically increases acceptance."
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Send Collaboration Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
