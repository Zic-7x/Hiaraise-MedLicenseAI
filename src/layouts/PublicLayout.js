// src/layouts/PublicLayout.js
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import MainLayout from './MainLayout';
import PublicNavbar from '../components/PublicNavbar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

// List of public routes that should be accessible even when logged in
const PUBLIC_ACCESSIBLE_ROUTES = ['/pricing', '/about', '/contact', '/vouchers', '/prometric-vouchers', '/my-vouchers', '/my-exams', '/get-exam-pass'];

export default function PublicLayout() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState(null);
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

  if (checking) {
    return <div className="text-center p-8">Checking authentication…</div>;
  }

  // If user is logged in and trying to access a non-public route, redirect to dashboard
  if (session && !PUBLIC_ACCESSIBLE_ROUTES.includes(location.pathname)) {
    return <Navigate to="/dashboard/user" replace />;
  }

  // Render the public routes with appropriate navbar
  return (
    <MainLayout>
      {session ? (
        // Use the full authenticated navbar for logged-in users accessing public pages
        <Navbar />
      ) : (
        // Use the public navbar for non-authenticated users
        <PublicNavbar />
      )}
      <Outlet />
    </MainLayout>
  );
}
