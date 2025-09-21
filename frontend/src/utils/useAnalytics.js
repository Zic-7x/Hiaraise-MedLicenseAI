import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackTimeOnPage, trackScrollDepth } from './analytics';
import { trackMetaPixelPageView, trackMetaPixelTimeOnPage, trackMetaPixelScrollDepth } from './metaPixel';

// Custom hook for tracking page views and user behavior
export const useAnalytics = () => {
  const location = useLocation();
  const pageStartTime = useRef(Date.now());
  const scrollDepthTracked = useRef(new Set());

  // Track page views when location changes
  useEffect(() => {
    trackPageView(location.pathname + location.search);
    trackMetaPixelPageView(location.pathname + location.search);
    pageStartTime.current = Date.now();
    scrollDepthTracked.current.clear();
  }, [location]);

  // Track time on page when component unmounts
  useEffect(() => {
    return () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000);
      if (timeSpent > 0) {
        trackTimeOnPage(timeSpent);
        trackMetaPixelTimeOnPage(timeSpent);
      }
    };
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track scroll depth at 25%, 50%, 75%, and 100%
      [25, 50, 75, 100].forEach(threshold => {
        if (scrollPercent >= threshold && !scrollDepthTracked.current.has(threshold)) {
          trackScrollDepth(threshold);
          trackMetaPixelScrollDepth(threshold);
          scrollDepthTracked.current.add(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return null;
};

// Hook for tracking form interactions
export const useFormAnalytics = (formName) => {
  const trackFormStart = () => {
    // Track when user starts filling out a form
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_start', {
        event_category: 'engagement',
        event_label: formName,
      });
    }
    // Meta Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CustomizeProduct', {
        content_name: 'Form Start',
        content_category: formName
      });
    }
  };

  const trackFormFieldInteraction = (fieldName, action) => {
    // Track field interactions (focus, blur, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_field_interaction', {
        event_category: 'engagement',
        event_label: `${formName}_${fieldName}_${action}`,
      });
    }
    // Meta Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CustomizeProduct', {
        content_name: 'Form Field Interaction',
        content_category: `${formName}_${fieldName}_${action}`
      });
    }
  };

  return { trackFormStart, trackFormFieldInteraction };
};

// Hook for tracking user engagement
export const useEngagementAnalytics = () => {
  const trackUserEngagement = (action, label, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'engagement',
        event_label: label,
        value: value,
      });
    }
    // Meta Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CustomizeProduct', {
        content_name: action,
        content_category: label,
        value: value
      });
    }
  };

  return { trackUserEngagement };
}; 
