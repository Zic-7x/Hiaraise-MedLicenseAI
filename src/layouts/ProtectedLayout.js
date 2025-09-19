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
        console.log("Fetching session...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session fetched:", session ? "Valid session" : "No session");
        setSession(session);

        if (session) {
          console.log("Fetching user role for user ID:", session.user.id);
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();

            if (error) throw error;
            console.log("User role fetched:", data.role);
            setUserRole(data.role);
          } catch (error) {
            console.error("Error loading profile:", error);
            setUserRole('user'); // Default fallback
          }
        } else {
          console.log("No session, setting userRole to null");
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
        setUserRole(null);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    getSessionAndRole();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, newSession ? "Valid session" : "No session");
      setSession(newSession);
    });

    return () => {
      console.log("Unsubscribing auth listener");
      listener.subscription.unsubscribe();
    };
  }, []);

  // Reload user role when session changes
  useEffect(() => {
    if (!session) {
      console.log("Session is null, clearing userRole");
      setUserRole(null);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      console.log("Reloading user role for user ID:", session.user.id);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        console.log("User role reloaded:", data.role);
        setUserRole(data.role);
      } catch (error) {
        console.error("Error reloading profile:", error);
        setUserRole('user'); // Default fallback
      } finally {
        console.log("Setting loading to false after role reload");
        setLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  // Handle authentication modal for non-logged-in users with delay to avoid flicker
  useEffect(() => {
    if (!session && !loading) {
      console.log("No session and not loading, opening auth modal");
      const timeout = setTimeout(() => {
        const onAuthSuccess = () => {
          console.log('Authentication successful, user can continue on current page');
        };
        openAuthModal('login', onAuthSuccess);
      }, 500); // Delay to avoid premature modal during session refresh
      return () => clearTimeout(timeout);
    }
  }, [session, loading, openAuthModal]);

  // Show loading state
  if (loading) {
    console.log("Rendering loading state");
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
  console.log("Checking access for path:", location.pathname, "with role:", userRole);
  if (!canAccessRoute(location.pathname, userRole)) {
    if (!session) {
      console.log("No session, redirecting to /login");
      return <Navigate to="/login" replace />;
    }
    console.log("User role not allowed, redirecting to /dashboard/user");
    return <Navigate to="/dashboard/user" replace />;
  }

  // Render protected routes
  console.log("Rendering protected route with role:", userRole);
  return (
    <MainLayout>
      <Navbar />
      <Outlet context={{ role: userRole }} />
    </MainLayout>
  );
}