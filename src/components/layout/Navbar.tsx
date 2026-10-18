import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from '../../hooks/useRouter';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { dataService } from '../../services/dataService';
import { SearchResults } from '../../types';
import {
  Bell,
  Search,
  Plus,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Layers,
  Compass,
  Users
} from 'lucide-react';
import { SEED_PROFILES } from '../../services/seedData';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCreateBuild: () => void;
  onOpenCreatePost: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenCreateBuild,
  onOpenCreatePost
}) => {
  const { profile, isAuthenticated, signOut, switchPersona } = useAuth();
  const { path, navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Poll notifications
  useEffect(() => {
    if (!profile) return;
    let isMounted = true;
    const loadNotifs = async () => {
      try {
        const data = await dataService.getNotifications(profile.id);
        if (isMounted) setUnreadCount(data.unreadCount);
      } catch {
        // Silent
      }
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [profile]);

  // Debounced search with clean state update
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await dataService.search(searchQuery);
        setSearchResults(res);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
    }
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Feed', href: '/', icon: <Sparkles size={14} /> },
    { label: 'Explore', href: '/explore', icon: <Compass size={14} /> },
    { label: 'Builds', href: '/builds', icon: <Layers size={14} /> },
    { label: 'Network', href: '/network', icon: <Users size={14} /> }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        height: 'var(--header-height)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)'
      }}
    >
      <div
        className="page-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          gap: '24px'
        }}
      >
        {/* Brand & Primary Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'var(--accent-primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)'
              }}
            >
              F
            </div>
            <span
              style={{
                fontSize: '19px',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              FORGE
            </span>
          </div>

          <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {navLinks.map((link) => {
              const active = link.href === '/' ? path === '/' || path === '/home' : path.startsWith(link.href);
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13.5px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'var(--accent-primary-muted)' : 'transparent',
                    border: active ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Integrated Search Bar with Glassmorphic Dropdown */}
        <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '320px' }} className="hide-on-mobile">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 12px',
              gap: '9px',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              transition: 'border-color 0.15s ease'
            }}
          >
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search projects, stack, or builders..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchResults(true);
              }}
              style={{
                width: '100%',
                fontSize: '12.5px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-elevated)',
                maxHeight: '380px',
                overflowY: 'auto',
                zIndex: 60,
                padding: '10px 0'
              }}
            >
              {isSearching ? (
                <div style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-tertiary)' }}>
                  Searching builds & engineers...
                </div>
              ) : searchResults && (searchResults.builds.length > 0 || searchResults.people.length > 0) ? (
                <>
                  {searchResults.builds.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div className="meta-label" style={{ padding: '4px 16px', fontSize: '10px' }}>
                        Projects
                      </div>
                      {searchResults.builds.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            navigate(`/builds/${b.slug}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            transition: 'background-color 0.12s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {b.title}
                          </span>
                          <span className="subtext" style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                            {b.summary.slice(0, 65)}...
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.people.length > 0 && (
                    <div>
                      <div className="meta-label" style={{ padding: '4px 16px', fontSize: '10px' }}>
                        Builders
                      </div>
                      {searchResults.people.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate(`/u/${p.username}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'background-color 0.12s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Avatar src={p.avatar} name={p.displayName} size="xs" />
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {p.displayName}
                            </span>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginLeft: '6px' }}>
                              @{p.username}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '14px 16px', fontSize: '12.5px', color: 'var(--text-tertiary)' }}>
                  No matches found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions & Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && profile ? (
            <>
              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                aria-label="Notifications"
                style={{
                  position: 'relative',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  color: path === '/notifications' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: path === '/notifications' ? 'var(--accent-primary-muted)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)')}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = path === '/notifications' ? 'var(--accent-primary-muted)' : 'transparent';
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary)',
                      boxShadow: '0 0 0 2px #ffffff'
                    }}
                  />
                )}
              </button>

              {/* Start Build Button */}
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={onOpenCreateBuild}
              >
                Start Build
              </Button>

              {/* User Dropdown */}
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <div
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '3px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <Avatar src={profile.avatar} name={profile.displayName} size="xs" />
                  <ChevronDown size={13} color="var(--text-tertiary)" />
                </div>

                {showUserDropdown && (
                  <div
                    className="card"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '230px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-elevated)',
                      padding: '8px 0',
                      zIndex: 60
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {profile.displayName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                        @{profile.username}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/u/${profile.username}`);
                        setShowUserDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '9px 16px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={15} color="var(--text-secondary)" /> Profile & Builds
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenCreatePost();
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '9px 16px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Plus size={15} color="var(--text-secondary)" /> Share Progress
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-hairline)', margin: '6px 0' }} />

                    {/* Switch Account */}
                    <div className="meta-label" style={{ padding: '6px 16px 4px', fontSize: '10px' }}>
                      Switch Account
                    </div>
                    {SEED_PROFILES.slice(0, 4).map((sp) => (
                      <div
                        key={sp.id}
                        onClick={async () => {
                          await switchPersona(sp.id);
                          setShowUserDropdown(false);
                        }}
                        style={{
                          padding: '7px 16px',
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          color: sp.id === profile.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontWeight: sp.id === profile.id ? 600 : 400
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Avatar src={sp.avatar} name={sp.displayName} size="xs" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sp.displayName}
                        </span>
                      </div>
                    ))}

                    <div style={{ borderTop: '1px solid var(--border-hairline)', margin: '6px 0' }} />

                    <button
                      onClick={async () => {
                        setShowUserDropdown(false);
                        await signOut();
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '9px 16px',
                        fontSize: '12.5px',
                        color: 'var(--danger-text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="ghost" size="sm" onClick={onOpenAuth}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={onOpenAuth}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
