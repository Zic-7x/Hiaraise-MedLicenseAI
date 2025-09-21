// Custom hook for route protection and access control
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { canAccessRoute, getRouteConfig } from '../utils/routeConfig';

export const useRouteGuard = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
        setUserRole('user');
      }
    };

    loadUserRole();
  }, [session]);

  const checkAccess = (path = location.pathname) => {
    return canAccessRoute(path, userRole);
  };

  const requireAuth = (redirectTo = '/login') => {
    if (!session) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  const requireRole = (roles, redirectTo = '/dashboard/user') => {
    if (!session) {
      navigate('/login');
      return false;
    }
    
    if (!roles.includes(userRole)) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  const getRouteInfo = (path = location.pathname) => {
    return getRouteConfig(path);
  };

  return {
    loading,
    session,
    userRole,
    checkAccess,
    requireAuth,
    requireRole,
    getRouteInfo,
    isAuthenticated: !!session,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user'
  };
};
