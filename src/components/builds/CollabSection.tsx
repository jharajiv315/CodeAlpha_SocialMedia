import React from 'react';
import { CollabPosting, CollaborationRequest } from '../../types';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { useRouter } from '../../hooks/useRouter';
import { Check, X, Users, MapPin, Clock } from 'lucide-react';

interface CollabSectionProps {
  posting?: CollabPosting;
  isOwner: boolean;
  requests: CollaborationRequest[];
  onOpenApplyModal: () => void;
  onRespondRequest: (requestId: string, status: 'ACCEPTED' | 'REJECTED') => void;
}

export const CollabSection: React.FC<CollabSectionProps> = ({
  posting,
  isOwner,
  requests,
  onOpenApplyModal,
  onRespondRequest
}) => {
  const { navigate } = useRouter();

  if (!posting && (!requests || requests.length === 0)) return null;

  return (
    <section className="card" style={{ padding: '28px 32px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Engineering Collaboration
          </h2>
          <p className="subtext" style={{ fontSize: '13px' }}>
            Open roles and co-engineering opportunities.
          </p>
        </div>

        {posting?.isOpen && !isOwner && (
          <Button variant="primary" size="sm" onClick={onOpenApplyModal}>
            Apply to Collaborate
          </Button>
        )}
      </div>

      {posting?.isOpen ? (
        <div
          style={{
            padding: '18px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.55 }}>
            {posting.description}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} color="var(--accent-primary)" />
              <span style={{ color: 'var(--text-tertiary)' }}>Roles: </span>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {posting.rolesNeeded.join(', ')}
              </strong>
            </div>

            {posting.estimatedDuration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--accent-primary)" />
                <span style={{ color: 'var(--text-tertiary)' }}>Duration: </span>
                <span>{posting.estimatedDuration}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--accent-primary)" />
              <span style={{ color: 'var(--text-tertiary)' }}>Location: </span>
              <span>{posting.locationType}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '13.5px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
          Not currently seeking external collaborators.
        </div>
      )}

      {/* Owner View: Pending and Processed Collaboration Requests */}
      {isOwner && requests.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div className="meta-label" style={{ marginBottom: '12px' }}>
            Applications Received ({requests.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {req.applicant && (
                    <div
                      onClick={() => navigate(`/u/${req.applicant?.username}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <Avatar src={req.applicant.avatar} name={req.applicant.displayName} size="xs" />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {req.applicant.displayName}
                      </span>
                      <span className="subtext" style={{ fontSize: '12px' }}>
                        applying for <strong>{req.roleApplied}</strong>
                      </span>
                    </div>
                  )}

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: req.status === 'ACCEPTED' ? '#f0fdf4' : req.status === 'REJECTED' ? '#fef2f2' : '#fefce8',
                      color: req.status === 'ACCEPTED' ? '#16a34a' : req.status === 'REJECTED' ? '#dc2626' : '#ca8a04',
                      border: `1px solid ${req.status === 'ACCEPTED' ? '#bbf7d0' : req.status === 'REJECTED' ? '#fecaca' : '#fef08a'}`
                    }}
                  >
                    {req.status}
                  </span>
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  "{req.message}"
                </p>

                {req.proofLinks && req.proofLinks.length > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
                    Proof: {req.proofLinks.join(', ')}
                  </div>
                )}

                {req.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignSelf: 'flex-end' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Check size={13} />}
                      onClick={() => onRespondRequest(req.id, 'ACCEPTED')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X size={13} />}
                      onClick={() => onRespondRequest(req.id, 'REJECTED')}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
