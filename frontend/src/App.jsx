import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { RequestFormModal } from './components/requests/RequestFormModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { RequestsPage } from './pages/RequestsPage';
import { UsersPage } from './pages/UsersPage';
import { NotificationsPage } from './pages/NotificationsPage';

function MainApp() {
  const { user, loading } = useAuth();

  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'requests', 'users', 'notifications'
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-dim)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }}
          />
          <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Chargement de CoPilote Entreprise...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleStatusFilterFromSidebar = (status) => {
    setStatusFilter(status);
    setCurrentView('requests');
  };

  const handleSelectRequestFromAnywhere = (requestId) => {
    setSelectedRequestId(requestId);
    setCurrentView('requests');
  };

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);
    if (query && currentView !== 'requests') {
      setCurrentView('requests');
    }
  };

  return (
    <div className="app-container">
      <ToastContainer />

      {/* Main Column */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
        {/* Top Navbar */}
        <Navbar
          onSearch={handleGlobalSearch}
          searchQuery={searchQuery}
          onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
        />

        {/* Layout Row with Sidebar + Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          <Sidebar
            currentView={currentView}
            onViewChange={(view) => {
              setCurrentView(view);
              if (view !== 'requests') setStatusFilter('');
            }}
            onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
            onFilterByStatus={handleStatusFilterFromSidebar}
          />

          <main className="main-content">
            <div className="content-wrapper">
              {currentView === 'dashboard' && (
                <DashboardPage
                  onSelectRequest={handleSelectRequestFromAnywhere}
                  onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
                />
              )}

              {currentView === 'requests' && (
                <RequestsPage
                  initialStatusFilter={statusFilter}
                  selectedRequestId={selectedRequestId}
                  onCloseSelectedRequest={() => setSelectedRequestId(null)}
                  onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
                  isNewRequestModalOpen={isNewRequestModalOpen}
                  onCloseNewRequestModal={() => setIsNewRequestModalOpen(false)}
                />
              )}

              {currentView === 'users' && <UsersPage />}

              {currentView === 'notifications' && (
                <NotificationsPage onSelectRequest={handleSelectRequestFromAnywhere} />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Global New Request Modal (if triggered outside requests page) */}
      {isNewRequestModalOpen && currentView !== 'requests' && (
        <RequestFormModal
          isOpen={isNewRequestModalOpen}
          onClose={() => setIsNewRequestModalOpen(false)}
          onSuccess={() => {
            setCurrentView('requests');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainApp />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
