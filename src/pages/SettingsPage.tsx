import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { Input, TextArea } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { showToast } from '../hooks/useToast';
import { Settings, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsFormProps {
  profile: UserProfile;
  onCancel: () => void;
}

const SettingsFormContent: React.FC<SettingsFormProps> = ({ profile, onCancel }) => {
  const { updateCurrentProfile } = useAuth();
  const { navigate } = useRouter();

  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [headline, setHeadline] = useState(profile.headline || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [github, setGithub] = useState(profile.github || '');
  const [buildingInput, setBuildingInput] = useState((profile.currentlyBuilding || []).join(', '));
  const [learningInput, setLearningInput] = useState((profile.currentlyLearning || []).join(', '));
  const [exploringInput, setExploringInput] = useState((profile.currentlyExploring || []).join(', '));
  const [openToCollab, setOpenToCollab] = useState(profile.openToCollaboration ?? true);
  const [collabPrefs, setCollabPrefs] = useState(profile.collaborationPreferences || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentlyBuilding = buildingInput.split(',').map((s) => s.trim()).filter(Boolean);
      const currentlyLearning = learningInput.split(',').map((s) => s.trim()).filter(Boolean);
      const currentlyExploring = exploringInput.split(',').map((s) => s.trim()).filter(Boolean);

      await updateCurrentProfile({
        displayName: displayName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim() || undefined,
        website: website.trim() || undefined,
        github: github.trim() || undefined,
        currentlyBuilding,
        currentlyLearning,
        currentlyExploring,
        openToCollaboration: openToCollab,
        collaborationPreferences: collabPrefs.trim() || undefined
      });

      showToast('Profile updated successfully!', 'success');
      navigate(`/u/${profile.username}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#ffffff' }}>
      <Input
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />

      <Input
        label="Technical Headline"
        value={headline}
        placeholder="e.g. Distributed Systems Engineer / Database Enthusiast"
        onChange={(e) => setHeadline(e.target.value)}
        required
      />

      <TextArea
        label="Technical Bio & Focus"
        value={bio}
        placeholder="Share your technical background, technologies you love, and what you are experimenting with..."
        onChange={(e) => setBio(e.target.value)}
        rows={3}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA or Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          label="Personal Website"
          placeholder="https://yourdomain.dev"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <Input
        label="GitHub Profile URL"
        placeholder="https://github.com/username"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />

      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Current Focus Areas (Comma-separated)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Currently Building"
            placeholder="e.g. ChronoCache, Nexora Commerce"
            value={buildingInput}
            onChange={(e) => setBuildingInput(e.target.value)}
          />

          <Input
            label="Currently Learning"
            placeholder="e.g. io_uring Async I/O, SIMD JSON parsing"
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
          />

          <Input
            label="Currently Exploring"
            placeholder="e.g. WebGPU Compute Shaders, Linux cgroups"
            value={exploringInput}
            onChange={(e) => setExploringInput(e.target.value)}
          />
        </div>
      </div>

      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Collaboration Preferences
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={openToCollab}
            onChange={(e) => setOpenToCollab(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }}
          />
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Open to new project collaborations and code reviews
          </span>
        </label>

        <Input
          label="What kind of projects or roles do you want to collaborate on?"
          placeholder="e.g. Systems performance, Rust backend, vector shaders..."
          value={collabPrefs}
          onChange={(e) => setCollabPrefs(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={loading} icon={<Save size={15} />}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export const SettingsPage: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  if (!isAuthenticated || !profile) {
    return (
      <div className="page-container" style={{ paddingTop: '80px', textAlign: 'center', maxWidth: '480px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Please sign in to edit settings
        </h2>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: '36px', paddingBottom: '96px', maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'var(--accent-primary-muted)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings size={18} />
          </div>
          <span className="meta-label">Account Settings</span>
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Profile Settings
        </h1>
        <p className="subtext" style={{ fontSize: '15px' }}>
          Update your public identity, current engineering focus, and collaboration terms.
        </p>
      </div>

      <SettingsFormContent
        key={profile.id}
        profile={profile}
        onCancel={() => navigate(`/u/${profile.username}`)}
      />
    </div>
  );
};
