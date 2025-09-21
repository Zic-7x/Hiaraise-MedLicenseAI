import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuthModal } from "../contexts/AuthModalContext";
import Navbar from '../components/Navbar';
import MainLayout from './MainLayout';
import { canAccessRoute } from '../utils/routeConfig';
import { useLocation } from 'react-router-dom';

export default function ProtectedLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const { openAuthModal } = useAuthModal();
  const location = useLocation();

  // Load session and role on initial mount, chaining the async calls
  useEffect(() => {
    const getSessionAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();

            if (error) throw error;
            setUserRole(data.role);
          } catch (error) {
            console.error("Error loading profile:", error);
            setUserRole('user'); // Default fallback
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndRole();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Reload user role when session changes
  useEffect(() => {
    if (!session) {
      setUserRole(null);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setUserRole(data.role);
      } catch (error) {
        console.error("Error reloading profile:", error);
        setUserRole('user'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  // Handle authentication modal for non-logged-in users with delay to avoid flicker
  useEffect(() => {
    if (!session && !loading) {
      const timeout = setTimeout(() => {
        const onAuthSuccess = () => {
        };
        openAuthModal('login', onAuthSuccess);
      }, 1000); // Increased delay to avoid conflicts with other auth flows
      return () => clearTimeout(timeout);
    }
  }, [session, loading, openAuthModal]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user can access the current route
  if (!canAccessRoute(location.pathname, userRole)) {
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/dashboard/user" replace />;
  }

  // Render protected routes
  return (
    <MainLayout>
      <Navbar />
      <Outlet context={{ role: userRole }} />
    </MainLayout>
  );
}
