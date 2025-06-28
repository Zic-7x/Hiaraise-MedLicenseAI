// src/layouts/ProtectedLayout.js
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from '../components/Navbar';
import MainLayout from './MainLayout';

export default function ProtectedLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

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

  // 3) Render loading state
  if (loading) {
    return <div className="text-center p-8">Loading…</div>;
  }

  // 4) If not logged in, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 5) Render protected routes and provide role via context
  return (
    <MainLayout>
      <Navbar />
      <Outlet context={{ role }} />
    </MainLayout>
  );
}
