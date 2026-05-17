import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Shared/Sidebar';
import TopBar from './components/Shared/TopBar';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import ApprovalsPage from './pages/ApprovalsPage';
import TeamPage from './pages/TeamPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditPage from './pages/AuditPage';
import NotificationsPage from './pages/NotificationsPage';
import SharedGoalsPage from './pages/SharedGoalsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { useStore } from './store/useStore';

function AppLayout() {
  const { currentUser } = useStore();
  const titles = {
    '/': 'Dashboard',
    '/goals': currentUser.role === 'admin' ? 'All Goals' : 'My Goals',
    '/approvals': 'Approvals',
    '/team': currentUser.role === 'admin' ? 'All Employees' : 'Team Overview',
    '/analytics': 'Analytics',
    '/audit': 'Audit Trail',
    '/notifications': 'Notifications',
    '/shared-goals': 'Shared Goals',
    '/admin': 'Admin Panel',
  };
  const path = window.location.pathname;
  const title = titles[path] || 'Dashboard';

  return (
    <div className="flex min-h-screen gradient-mesh">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'manager' ? 'Manager' : 'Employee'} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-dark-800)',
              color: 'var(--color-dark-50)',
              border: '1px solid var(--color-dark-600)',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-dark-800)',
            color: 'var(--color-dark-50)',
            border: '1px solid var(--color-dark-600)',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="shared-goals" element={<SharedGoalsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
