import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { sanitizeUrl } from '../../utils/security';
import { showToast } from '../../hooks/useToast';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildId: string;
  onMilestoneAdded?: () => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  buildId,
  onMilestoneAdded
}) => {
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError('');

    if (!title.trim()) {
      setError('Please provide a milestone title');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a milestone description');
      return;
    }

    if (externalUrl.trim() && !sanitizeUrl(externalUrl)) {
      setError('Please provide a valid external proof URL (e.g. commit hash link or live release)');
      return;
    }

    setLoading(true);
    try {
      await dataService.createMilestone(
        {
          buildId,
          title: title.trim(),
          date,
          description: description.trim(),
          externalUrl: externalUrl.trim() || undefined
        },
        profile.id
      );

      showToast('Milestone achieved and recorded!', 'success');
      setTitle('');
      setDescription('');
      setExternalUrl('');
      onClose();
      if (onMilestoneAdded) onMilestoneAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to create milestone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Project Milestone"
      subtitle="Milestones form your verifiable longitudinal track record."
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
          label="Milestone Title"
          placeholder="e.g. 10,000 Req/Min Stress Test Passed or Crates.io v1.0 Release"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="Date Achieved"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <TextArea
          label="Verification & Details"
          placeholder="What specifically was verified, tested, or deployed at this checkpoint?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />

        <Input
          label="External Proof Link (Optional)"
          placeholder="e.g. Commit hash, release tag, benchmark log URL"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Save Milestone
          </Button>
        </div>
      </form>
    </Modal>
  );
};
