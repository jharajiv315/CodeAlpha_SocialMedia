import React, { useState, useEffect } from 'react';
import { useRouter } from './hooks/useRouter';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { BuildsDirectoryPage } from './pages/BuildsDirectoryPage';
import { BuildDetailPage } from './pages/BuildDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { NetworkPage } from './pages/NetworkPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Modals
import { AuthModal } from './features/auth/AuthModal';
import { OnboardingModal } from './features/auth/OnboardingModal';
import { CreateBuildModal } from './features/builds/CreateBuildModal';
import { Modal } from './components/common/Modal';
import { PostComposer } from './components/feed/PostComposer';

import './App.css';

export function App() {
  const { path, matchRoute, navigate } = useRouter();
  const { profile, isAuthenticated, loading: authLoading } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showCreateBuildModal, setShowCreateBuildModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Check if newly signed in user lacks profile
  useEffect(() => {
    let timeoutId: number;
    if (!authLoading && isAuthenticated && !profile) {
      timeoutId = window.setTimeout(() => {
        setShowOnboardingModal(true);
      }, 0);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authLoading, isAuthenticated, profile]);

  // Dynamic document title
  useEffect(() => {
    if (path === '/' || path === '/home') {
      document.title = 'FORGE — Show what you are building';
    } else if (path === '/explore') {
      document.title = 'Explore Proof of Work — FORGE';
    } else if (path === '/builds') {
      document.title = 'Engineering Builds Directory — FORGE';
    } else if (path === '/network') {
      document.title = 'Active Builders Network — FORGE';
    } else if (path === '/notifications') {
      document.title = 'Notifications — FORGE';
    } else if (path === '/settings') {
      document.title = 'Profile Settings — FORGE';
    } else if (path.startsWith('/u/')) {
      document.title = `${path.replace('/u/', '@')} — FORGE`;
    } else if (path.startsWith('/builds/')) {
      document.title = `Build — FORGE`;
    } else {
      document.title = 'FORGE';
    }
  }, [path]);

  // Route Rendering
  const renderCurrentRoute = () => {
    // 1. Root / Home
    if (path === '/' || path === '/home') {
      return (
        <HomePage
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenCreateBuild={() => setShowCreateBuildModal(true)}
        />
      );
    }

    // 2. Explore
    if (path === '/explore') {
      return <ExplorePage />;
    }

    // 3. Builds Directory
    if (path === '/builds') {
      return (
        <BuildsDirectoryPage
          onOpenCreateBuild={() => setShowCreateBuildModal(true)}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      );
    }

    // 4. Build Detail (/builds/:slug)
    const buildMatch = matchRoute('/builds/:slug');
    if (buildMatch.match && buildMatch.params.slug) {
      return (
        <BuildDetailPage
          slug={buildMatch.params.slug}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      );
    }

    // 5. Profile (/u/:username)
    const profileMatch = matchRoute('/u/:username');
    if (profileMatch.match && profileMatch.params.username) {
      return (
        <ProfilePage
          username={profileMatch.params.username}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenCreateBuild={() => setShowCreateBuildModal(true)}
          onOpenEditProfile={() => navigate('/settings')}
        />
      );
    }

    // 6. Network
    if (path === '/network') {
      return <NetworkPage onOpenAuth={() => setShowAuthModal(true)} />;
    }

    // 7. Notifications
    if (path === '/notifications') {
      return <NotificationsPage onOpenAuth={() => setShowAuthModal(true)} />;
    }

    // 8. Settings
    if (path === '/settings') {
      return <SettingsPage />;
    }

    // 9. 404 Fallback
    return <NotFoundPage />;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenCreateBuild={() => setShowCreateBuildModal(true)}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
      />

      {/* Main Dynamic View */}
      <main style={{ flex: 1 }}>{renderCurrentRoute()}</main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onOpenCreateBuild={() => setShowCreateBuildModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Global Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onRequireOnboarding={() => setShowOnboardingModal(true)}
        />
      )}

      {showOnboardingModal && (
        <OnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}

      {showCreateBuildModal && (
        <CreateBuildModal
          isOpen={showCreateBuildModal}
          onClose={() => setShowCreateBuildModal(false)}
          onBuildCreated={(slug) => navigate(`/builds/${slug}`)}
        />
      )}

      {showCreatePostModal && (
        <Modal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          title="Share Progress or Technical Insight"
          subtitle="Document what you built, what broke, or lessons learned."
        >
          <PostComposer
            onPostCreated={() => {
              setShowCreatePostModal(false);
              navigate('/');
            }}
          />
        </Modal>
      )}

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
}

export default App;
