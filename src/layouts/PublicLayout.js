// src/layouts/PublicLayout.js
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import MainLayout from './MainLayout';
import PublicNavbar from '../components/PublicNavbar';
import { Link } from 'react-router-dom';

// List of public routes that should be accessible even when logged in
const PUBLIC_ACCESSIBLE_ROUTES = ['/services', '/about', '/contact'];

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
        // Use the authenticated navbar for logged-in users accessing public pages
        <div className="bg-blue-700 text-white px-4 md:px-6 py-3 shadow-lg rounded-lg mt-2 mb-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/services" className="hover:text-teal-200 focus:text-teal-300 transition-colors font-semibold">Services</Link>
            <Link to="/about" className="hover:text-teal-200 focus:text-teal-300 transition-colors font-semibold">About Us</Link>
            <Link to="/contact" className="hover:text-teal-200 focus:text-teal-300 transition-colors font-semibold">Contact</Link>
            <Link to="/dashboard/user" className="hover:text-teal-200 focus:text-teal-300 transition-colors font-semibold">Dashboard</Link>
          </div>
        </div>
      ) : (
        // Use the public navbar for non-authenticated users
        <PublicNavbar />
      )}
      <Outlet />
    </MainLayout>
  );
}
