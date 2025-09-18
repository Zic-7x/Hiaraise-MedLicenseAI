// src/layouts/ProtectedLayout.js
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuthModal } from "../contexts/AuthModalContext";
import Navbar from '../components/Navbar';
import MainLayout from './MainLayout';

export default function ProtectedLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const { openAuthModal } = useAuthModal();

  // 1) On mount, get any existing session and set up listener
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2) Once session exists, fetch the user's role
  useEffect(() => {
    if (!session) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          throw error;
        }

        setRole(data.role);
      } catch (error) {
        console.error("Error loading profile:", error);
        // Optional: force sign out on error
        // await supabase.auth.signOut();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  // 3) Handle auth modal opening when not logged in
  useEffect(() => {
    if (!session && !loading) {
      // Provide a success callback that keeps users on their current page
      // instead of redirecting to dashboard
      const onAuthSuccess = () => {
        // Just close the modal and let the user continue on their current page
        console.log('Authentication successful, user can continue on current page');
      };
      
      openAuthModal('login', onAuthSuccess);
    }
  }, [session, loading, openAuthModal]);

  // 3) Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // 4) If not logged in, show loading state while modal is opening
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Please log in to continue...</p>
          </div>
        </div>
      </div>
    );
  }

  // 5) Render protected routes and provide role via context
  return (
    <MainLayout>
      <Navbar />
      <Outlet context={{ role }} />
    </MainLayout>
  );
}
