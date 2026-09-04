import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import './index.css';

function AdminApp() {
  const { session, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8123D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <AdminLogin onSuccess={() => window.location.reload()} />;
  }

  return (
    <div>
      <AdminDashboard />
      <button
        onClick={() => signOut()}
        className="fixed bottom-4 left-4 z-50 px-4 py-2 rounded-xl bg-[#141414] border border-[#262626] text-red-400 text-xs font-bold"
      >
        تسجيل خروج
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  </StrictMode>
);
