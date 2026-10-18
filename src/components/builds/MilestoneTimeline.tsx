import React from 'react';
import { BuildMilestone } from '../../types';
import { Button } from '../common/Button';
import { EditorialText } from '../common/EditorialText';
import { sanitizeUrl } from '../../utils/security';
import { Plus, ExternalLink } from 'lucide-react';

interface MilestoneTimelineProps {
  milestones: BuildMilestone[];
  isOwner: boolean;
  onAddMilestone: () => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  isOwner,
  onAddMilestone
}) => {
  return (
    <section className="card" style={{ padding: '28px 32px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Project Journey & Milestones
          </h2>
          <p className="subtext" style={{ fontSize: '13px' }}>
            Verifiable checkpoints and technical architecture releases.
          </p>
        </div>

        {isOwner && (
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={onAddMilestone}>
            Record Milestone
          </Button>
        )}
      </div>

      {milestones.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '13.5px', fontStyle: 'italic', padding: '16px 0' }}>
          No milestones recorded yet. Document your first breakthrough.
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Timeline Vertical Line */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              bottom: '8px',
              left: '6px',
              width: '2px',
              backgroundColor: 'var(--border-subtle)'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {milestones.map((ms) => (
              <div key={ms.id} style={{ position: 'relative' }}>
                {/* Timeline Checkpoint Node */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-24px',
                    top: '4px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid var(--accent-primary)',
                    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)'
                  }}
                />

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px 20px'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {ms.date}
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {ms.title}
                  </h3>

                  <EditorialText
                    content={ms.description}
                    style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}
                  />

                  {sanitizeUrl(ms.externalUrl) && (
                    <a
                      href={sanitizeUrl(ms.externalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        marginTop: '10px'
                      }}
                    >
                      <ExternalLink size={13} /> View Verifiable Proof
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
