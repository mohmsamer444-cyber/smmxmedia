import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Drawer } from './components/common/Drawer';
import { FloatingButtons } from './components/common/FloatingButtons';
import { ToastContainer } from './components/common/Toast';

import { SocialFeedPage } from './components/feed/SocialFeedPage';
import { ServicesPage } from './components/services/ServicesPage';
import { GameTopUpPage } from './components/games/GameTopUpPage';
import { OrderHistoryPage } from './components/orders/OrderHistoryPage';

import { OrderModal } from './components/modals/OrderModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { GameTopUpModal } from './components/modals/GameTopUpModal';
import { DepositModal } from './components/modals/DepositModal';
import { QuickActionModal } from './components/modals/QuickActionModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { ApiSettingsModal } from './components/modals/ApiSettingsModal';
import { ResellerSubPanelModal } from './components/modals/ResellerSubPanelModal';
import { AffiliateModal } from './components/modals/AffiliateModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { AvatarUploadModal } from './components/modals/AvatarUploadModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    isDarkMode,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    isResellerModalOpen,
    closeResellerModal,
    isAffiliateModalOpen,
    closeAffiliateModal,
  } = useApp();

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden font-sans transition-colors duration-200 relative ${
        isDarkMode ? 'bg-[#0A0A0A] text-white' : 'bg-gray-100 text-gray-900'
      }`}
      dir="rtl"
    >
      {/* Subtle Cinematic Film Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-30 film-grain opacity-30 mix-blend-overlay" />

      {/* Top Navigation Header */}
      <Header onOpenDrawer={openDrawer} />

      {/* Main View Area */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 overflow-x-hidden">
        {activeTab === 'feed' && <SocialFeedPage />}
        {activeTab === 'services' && <ServicesPage />}
        {activeTab === 'games' && <GameTopUpPage />}
        {activeTab === 'orders' && <OrderHistoryPage />}
      </main>

      {/* Floating Action Buttons */}
      <FloatingButtons />

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Slide-over Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Global Toast Notification */}
      <ToastContainer />

      {/* Modals */}
      <OrderModal />
      <CreatePostModal />
      <GameTopUpModal />
      <DepositModal />
      <QuickActionModal />
      <UserProfileModal />
      <ApiSettingsModal />
      <ResellerSubPanelModal isOpen={isResellerModalOpen} onClose={closeResellerModal} />
      <AffiliateModal isOpen={isAffiliateModalOpen} onClose={closeAffiliateModal} />
      <LightboxModal />
      <AvatarUploadModal />
    </div>
  );
};

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
