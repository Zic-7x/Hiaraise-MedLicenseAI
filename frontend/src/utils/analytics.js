// Google Analytics utility functions
export const GA_TRACKING_ID = 'G-BFD5H9R73Z';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName) => {
  trackEvent('form_submit', 'engagement', formName);
};

// Track button clicks
export const trackButtonClick = (buttonName, location) => {
  trackEvent('button_click', 'engagement', buttonName, location);
};

// Track user registration
export const trackRegistration = (method = 'email') => {
  trackEvent('sign_up', 'engagement', method);
};

// Track user login
export const trackLogin = (method = 'email') => {
  trackEvent('login', 'engagement', method);
};

// Track case submission
export const trackCaseSubmission = (country) => {
  trackEvent('case_submission', 'business', country);
};

// Track payment
export const trackPayment = (amount, currency = 'USD') => {
  trackEvent('purchase', 'ecommerce', currency, amount);
};

// Track chat widget interactions
export const trackChatInteraction = (action) => {
  trackEvent('chat_interaction', 'engagement', action);
};

// Track document uploads
export const trackDocumentUpload = (documentType) => {
  trackEvent('document_upload', 'engagement', documentType);
};

// Track country selection
export const trackCountrySelection = (country) => {
  trackEvent('country_selection', 'engagement', country);
};

// Track modal interactions
export const trackModalInteraction = (modalName, action) => {
  trackEvent('modal_interaction', 'engagement', `${modalName}_${action}`);
};

// Track search queries
export const trackSearch = (searchTerm) => {
  trackEvent('search', 'engagement', searchTerm);
};

// Track external link clicks
export const trackExternalLink = (url) => {
  trackEvent('external_link_click', 'engagement', url);
};

// Track scroll depth
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll_depth', 'engagement', `${percentage}%`);
};

// Track time on page
export const trackTimeOnPage = (seconds) => {
  trackEvent('time_on_page', 'engagement', 'seconds', seconds);
}; 
