import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { showToast } from '../hooks/useToast';
import { Bell, CheckCheck } from 'lucide-react';

interface NotificationsPageProps {
  onOpenAuth: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onOpenAuth }) => {
  const { profile, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(() => Boolean(profile));

  useEffect(() => {
    let isMounted = true;
    if (!profile) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await dataService.getNotifications(profile.id);
        if (isMounted) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  if (!isAuthenticated || !profile) {
    return (
      <div className="page-container" style={{ paddingTop: '80px', textAlign: 'center', maxWidth: '480px' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            backgroundColor: 'var(--accent-primary-muted)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Bell size={22} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Sign in to view notifications
        </h2>
        <p className="subtext" style={{ marginBottom: '24px' }}>
          Receive live updates on your projects, feedback, and collaboration requests from other engineers.
        </p>
        <Button variant="primary" onClick={onOpenAuth}>
          Sign In
        </Button>
      </div>
    );
  }

  const handleMarkAllRead = async () => {
    if (!profile) return;
    await dataService.markAllNotificationsRead(profile.id);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    showToast('All notifications marked as read', 'info');
  };

  const handleClick = async (n: Notification) => {
    if (!profile) return;
    if (!n.read) {
      await dataService.markNotificationRead(n.id, profile.id);
      setNotifications(notifications.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
    if (n.targetType === 'BUILD') {
      navigate(`/builds/${n.targetId}`);
    } else if (n.targetType === 'USER' && n.actor) {
      navigate(`/u/${n.actor.username}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '36px', paddingBottom: '96px', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Notifications
          </h1>
          <p className="subtext" style={{ marginTop: '2px' }}>
            Activity, appreciations, and collaboration updates
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CheckCheck size={14} color="var(--accent-primary)" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </div>
      ) : notifications.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: '#f1f5f9',
              color: 'var(--text-tertiary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}
          >
            <Bell size={20} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            You're all caught up!
          </h3>
          <p className="subtext">
            When other engineers appreciate your projects or apply to collaborate, updates will appear here.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '8px 0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
          {notifications.map((n, idx) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                borderBottom: idx < notifications.length - 1 ? '1px solid var(--border-hairline)' : 'none',
                cursor: 'pointer',
                backgroundColor: n.read ? '#ffffff' : 'rgba(238, 242, 255, 0.45)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = n.read ? '#ffffff' : 'rgba(238, 242, 255, 0.45)';
              }}
            >
              <Avatar src={n.actor?.avatar} name={n.actor?.displayName || 'User'} size="sm" />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  <strong style={{ fontWeight: 700 }}>{n.actor?.displayName}</strong> {n.summary}
                </div>
                <div className="subtext" style={{ fontSize: '11.5px', marginTop: '3px', color: 'var(--text-tertiary)' }}>
                  {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {!n.read && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
                    flexShrink: 0
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
