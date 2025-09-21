// Meta Pixel utility functions
export const META_PIXEL_ID = '1665546150811366';

// Initialize Meta Pixel
export const initMetaPixel = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
};

// Track page views
export const trackMetaPixelPageView = (url) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView', {
      page_path: url,
      page_title: document.title,
    });
  }
};

// Track custom events
export const trackMetaPixelEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Track form submissions
export const trackMetaPixelFormSubmission = (formName, value = 0) => {
  trackMetaPixelEvent('Lead', {
    content_name: formName,
    value: value,
    currency: 'USD'
  });
};

// Track button clicks
export const trackMetaPixelButtonClick = (buttonName, location) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: buttonName,
    content_category: location
  });
};

// Track user registration
export const trackMetaPixelRegistration = (method = 'email') => {
  trackMetaPixelEvent('CompleteRegistration', {
    registration_source: method
  });
};

// Track user login
export const trackMetaPixelLogin = (method = 'email') => {
  trackMetaPixelEvent('Login', {
    login_source: method
  });
};

// Track case submission
export const trackMetaPixelCaseSubmission = (country, value = 0) => {
  trackMetaPixelEvent('Lead', {
    content_name: 'Case Submission',
    content_category: country,
    value: value,
    currency: 'USD'
  });
};

// Track payment
export const trackMetaPixelPayment = (amount, currency = 'USD') => {
  trackMetaPixelEvent('Purchase', {
    value: amount,
    currency: currency
  });
};

// Track add to cart (for services)
export const trackMetaPixelAddToCart = (serviceName, value = 0) => {
  trackMetaPixelEvent('AddToCart', {
    content_name: serviceName,
    value: value,
    currency: 'USD'
  });
};

// Track initiate checkout
export const trackMetaPixelInitiateCheckout = (value = 0) => {
  trackMetaPixelEvent('InitiateCheckout', {
    value: value,
    currency: 'USD'
  });
};

// Track contact form submissions
export const trackMetaPixelContact = () => {
  trackMetaPixelEvent('Contact');
};

// Track document uploads
export const trackMetaPixelDocumentUpload = (documentType) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: 'Document Upload',
    content_category: documentType
  });
};

// Track country selection
export const trackMetaPixelCountrySelection = (country) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: 'Country Selection',
    content_category: country
  });
};

// Track modal interactions
export const trackMetaPixelModalInteraction = (modalName, action) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: `${modalName} Modal`,
    content_category: action
  });
};

// Track search queries
export const trackMetaPixelSearch = (searchTerm) => {
  trackMetaPixelEvent('Search', {
    search_string: searchTerm
  });
};

// Track external link clicks
export const trackMetaPixelExternalLink = (url) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: 'External Link Click',
    content_category: url
  });
};

// Track scroll depth
export const trackMetaPixelScrollDepth = (percentage) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: 'Scroll Depth',
    content_category: `${percentage}%`
  });
};

// Track time on page
export const trackMetaPixelTimeOnPage = (seconds) => {
  trackMetaPixelEvent('CustomizeProduct', {
    content_name: 'Time on Page',
    content_category: `${seconds} seconds`
  });
};

// Track view content (for specific pages/services)
export const trackMetaPixelViewContent = (contentName, value = 0) => {
  trackMetaPixelEvent('ViewContent', {
    content_name: contentName,
    value: value,
    currency: 'USD'
  });
};

// Track add to wishlist (for services)
export const trackMetaPixelAddToWishlist = (serviceName) => {
  trackMetaPixelEvent('AddToWishlist', {
    content_name: serviceName
  });
};

// Track start trial (if applicable)
export const trackMetaPixelStartTrial = (trialType) => {
  trackMetaPixelEvent('StartTrial', {
    content_name: trialType
  });
};

// Track subscription (if applicable)
export const trackMetaPixelSubscribe = (planName, value = 0) => {
  trackMetaPixelEvent('Subscribe', {
    content_name: planName,
    value: value,
    currency: 'USD'
  });
}; 
