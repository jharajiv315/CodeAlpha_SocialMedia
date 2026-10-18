import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { showToast } from '../../hooks/useToast';
import { GithubIcon } from '../common/Icons';
import { sanitizeUrl } from '../../utils/security';
import { Globe, MapPin, Share2, Layers, Users } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onOpenEditModal: () => void;
  onOpenAuth: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile,
  onOpenEditModal,
  onOpenAuth
}) => {
  const { profile: currentAuthProfile } = useAuth();
  const [isFollowing, setIsFollowing] = useState(() =>
    currentAuthProfile ? dataService.isFollowingUser(currentAuthProfile.id, profile.id) : false
  );
  const [followersCount, setFollowersCount] = useState(profile.followersCount || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFollowToggle = async () => {
    if (!currentAuthProfile) {
      onOpenAuth();
      return;
    }
    if (isUpdating) return;

    const prevFollowing = isFollowing;
    const prevCount = followersCount;
    setIsFollowing(!prevFollowing);
    setFollowersCount(prevFollowing ? prevCount - 1 : prevCount + 1);
    setIsUpdating(true);

    try {
      const res = await dataService.toggleFollowUser(profile.id, currentAuthProfile.id);
      setIsFollowing(res.isFollowing);
      setFollowersCount(res.newFollowerCount);
      showToast(res.isFollowing ? `Now following @${profile.username}` : `Unfollowed @${profile.username}`, 'info');
    } catch (err: any) {
      setIsFollowing(prevFollowing);
      setFollowersCount(prevCount);
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard', 'info');
    }
  };

  return (
    <header
      className="card"
      style={{
        padding: '32px 36px',
        marginBottom: '28px',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Top: Avatar & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Avatar src={profile.avatar} name={profile.displayName} size="xl" showCollabBadge={profile.openToCollaboration} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isOwnProfile ? (
            <Button variant="secondary" size="sm" onClick={onOpenEditModal}>
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleFollowToggle}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}

          <button
            onClick={handleShare}
            title="Share Profile"
            className="btn btn-secondary btn-sm"
            style={{ padding: '7px 10px' }}
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Name, Handle & Headline */}
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.25,
          marginBottom: '4px'
        }}
      >
        {profile.displayName}
      </h1>

      <div style={{ fontSize: '13.5px', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '12px' }}>
        @{profile.username}
      </div>

      <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: '680px', marginBottom: '14px' }}>
        {profile.headline}
      </p>

      {profile.bio && (
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.65, maxWidth: '680px', marginBottom: '18px' }}>
          {profile.bio}
        </p>
      )}

      {/* Meta Stats & External Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-hairline)',
          fontSize: '13px',
          color: 'var(--text-tertiary)'
        }}
      >
        {profile.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={14} color="var(--accent-primary)" /> {profile.location}
          </span>
        )}

        {sanitizeUrl(profile.website) && (
          <a
            href={sanitizeUrl(profile.website)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', fontWeight: 500 }}
          >
            <Globe size={14} /> {profile.website?.replace(/^https?:\/\//, '')}
          </a>
        )}

        {sanitizeUrl(profile.github) && (
          <a
            href={sanitizeUrl(profile.github)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontWeight: 500 }}
          >
            <GithubIcon size={14} /> GitHub
          </a>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Layers size={14} color="var(--accent-primary)" />
            <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{profile.buildsCount || 0}</strong> projects
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Users size={14} color="var(--accent-primary)" />
            <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{followersCount}</strong> followers
          </span>
        </div>
      </div>
    </header>
  );
};
