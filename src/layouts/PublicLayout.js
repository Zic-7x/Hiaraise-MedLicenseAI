// Improved PublicLayout with better access control
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import MainLayout from './MainLayout';
import PublicNavbar from '../components/PublicNavbar';
import Navbar from '../components/Navbar';
import { isPublicRoute, isHybridRoute, canAccessRoute } from '../utils/routeConfig';

export default function PublicLayout() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });

    // Listen for future auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Load user role when session changes
  useEffect(() => {
    if (!session) {
      setUserRole(null);
      return;
    }

    const loadUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setUserRole(data.role);
      } catch (error) {
        console.error("Error loading user role:", error);
        setUserRole('user'); // Default fallback
      }
    };

    loadUserRole();
  }, [session]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>
    );
  }

  const currentPath = location.pathname;

  // PublicLayout should only handle public and hybrid routes
  // If this is a protected route, don't interfere - let ProtectedLayout handle it
  if (!isPublicRoute(currentPath) && !isHybridRoute(currentPath)) {
    // This is a protected route - don't render anything, let React Router handle the transition
    return null;
  }

  // For public/hybrid routes, check access only if user is not logged in
  if (!session && !canAccessRoute(currentPath, null)) {
    return <Navigate to="/login" replace />;
  }

  // Determine which navbar to show
  const showAuthenticatedNavbar = session && (isHybridRoute(currentPath) || isPublicRoute(currentPath));

  return (
    <MainLayout>
      {showAuthenticatedNavbar ? (
        <Navbar />
      ) : (
        <PublicNavbar />
      )}
      <Outlet />
    </MainLayout>
  );
}
