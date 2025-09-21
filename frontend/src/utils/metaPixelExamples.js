// Meta Pixel Integration Examples
// This file shows how to integrate Meta Pixel tracking into your React components

import { 
  trackMetaPixelRegistration, 
  trackMetaPixelLogin, 
  trackMetaPixelFormSubmission,
  trackMetaPixelButtonClick,
  trackMetaPixelCaseSubmission,
  trackMetaPixelPayment,
  trackMetaPixelContact,
  trackMetaPixelViewContent,
  trackMetaPixelAddToCart,
  trackMetaPixelInitiateCheckout,
  trackMetaPixelCountrySelection,
  trackMetaPixelDocumentUpload
} from './metaPixel';

// Example 1: Registration Component Integration
export const useRegistrationTracking = () => {
  const trackRegistrationStart = () => {
    trackMetaPixelFormSubmission('Registration Form Start');
  };

  const trackRegistrationComplete = (method = 'email') => {
    trackMetaPixelRegistration(method);
  };

  const trackRegistrationError = (errorType) => {
    trackMetaPixelButtonClick('Registration Error', errorType);
  };

  return {
    trackRegistrationStart,
    trackRegistrationComplete,
    trackRegistrationError
  };
};

// Example 2: Login Component Integration
export const useLoginTracking = () => {
  const trackLoginAttempt = () => {
    trackMetaPixelFormSubmission('Login Form Start');
  };

  const trackLoginSuccess = (method = 'email') => {
    trackMetaPixelLogin(method);
  };

  const trackLoginError = (errorType) => {
    trackMetaPixelButtonClick('Login Error', errorType);
  };

  return {
    trackLoginAttempt,
    trackLoginSuccess,
    trackLoginError
  };
};

// Example 3: Case Submission Integration
export const useCaseSubmissionTracking = () => {
  const trackCaseFormStart = () => {
    trackMetaPixelFormSubmission('Case Submission Form Start');
  };

  const trackCaseSubmissionComplete = (country, value = 0) => {
    trackMetaPixelCaseSubmission(country, value);
  };

  const trackDocumentUpload = (documentType) => {
    trackMetaPixelDocumentUpload(documentType);
  };

  const trackCountrySelection = (country) => {
    trackMetaPixelCountrySelection(country);
  };

  return {
    trackCaseFormStart,
    trackCaseSubmissionComplete,
    trackDocumentUpload,
    trackCountrySelection
  };
};

// Example 4: Payment/Checkout Integration
export const usePaymentTracking = () => {
  const trackServiceSelection = (serviceName, value = 0) => {
    trackMetaPixelAddToCart(serviceName, value);
  };

  const trackCheckoutStart = (value = 0) => {
    trackMetaPixelInitiateCheckout(value);
  };

  const trackPaymentComplete = (amount, currency = 'USD') => {
    trackMetaPixelPayment(amount, currency);
  };

  return {
    trackServiceSelection,
    trackCheckoutStart,
    trackPaymentComplete
  };
};

// Example 5: Contact Form Integration
export const useContactTracking = () => {
  const trackContactFormStart = () => {
    trackMetaPixelFormSubmission('Contact Form Start');
  };

  const trackContactSubmit = () => {
    trackMetaPixelContact();
  };

  return {
    trackContactFormStart,
    trackContactSubmit
  };
};

// Example 6: Page Content Tracking
export const usePageContentTracking = () => {
  const trackServicePageView = (serviceName) => {
    trackMetaPixelViewContent(serviceName);
  };

  const trackAboutPageView = () => {
    trackMetaPixelViewContent('About Page');
  };

  const trackContactPageView = () => {
    trackMetaPixelViewContent('Contact Page');
  };

  return {
    trackServicePageView,
    trackAboutPageView,
    trackContactPageView
  };
};

// Example 7: Button Click Tracking
export const useButtonTracking = () => {
  const trackCTAClick = (buttonName, location) => {
    trackMetaPixelButtonClick(buttonName, location);
  };

  const trackNavigationClick = (destination) => {
    trackMetaPixelButtonClick('Navigation', destination);
  };

  const trackSocialMediaClick = (platform) => {
    trackMetaPixelButtonClick('Social Media', platform);
  };

  return {
    trackCTAClick,
    trackNavigationClick,
    trackSocialMediaClick
  };
};

// Example 8: Form Field Tracking
export const useFormFieldTracking = () => {
  const trackFieldFocus = (formName, fieldName) => {
    trackMetaPixelButtonClick('Form Field Focus', `${formName}_${fieldName}`);
  };

  const trackFieldBlur = (formName, fieldName) => {
    trackMetaPixelButtonClick('Form Field Blur', `${formName}_${fieldName}`);
  };

  const trackFieldChange = (formName, fieldName) => {
    trackMetaPixelButtonClick('Form Field Change', `${formName}_${fieldName}`);
  };

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackFieldChange
  };
};

// Example 9: Modal/Dialog Tracking
export const useModalTracking = () => {
  const trackModalOpen = (modalName) => {
    trackMetaPixelButtonClick('Modal Open', modalName);
  };

  const trackModalClose = (modalName) => {
    trackMetaPixelButtonClick('Modal Close', modalName);
  };

  const trackModalAction = (modalName, action) => {
    trackMetaPixelButtonClick('Modal Action', `${modalName}_${action}`);
  };

  return {
    trackModalOpen,
    trackModalClose,
    trackModalAction
  };
};

// Example 10: Error Tracking
export const useErrorTracking = () => {
  const trackFormError = (formName, errorType) => {
    trackMetaPixelButtonClick('Form Error', `${formName}_${errorType}`);
  };

  const trackValidationError = (fieldName, errorType) => {
    trackMetaPixelButtonClick('Validation Error', `${fieldName}_${errorType}`);
  };

  const trackSystemError = (errorType) => {
    trackMetaPixelButtonClick('System Error', errorType);
  };

  return {
    trackFormError,
    trackValidationError,
    trackSystemError
  };
};

// Example 11: User Journey Tracking
export const useUserJourneyTracking = () => {
  const trackLandingPageView = () => {
    trackMetaPixelViewContent('Landing Page');
  };

  const trackServicePageView = (serviceName) => {
    trackMetaPixelViewContent(`Service: ${serviceName}`);
  };

  const trackDashboardView = () => {
    trackMetaPixelViewContent('User Dashboard');
  };

  const trackProfileView = () => {
    trackMetaPixelViewContent('User Profile');
  };

  return {
    trackLandingPageView,
    trackServicePageView,
    trackDashboardView,
    trackProfileView
  };
};

// Example 12: Conversion Funnel Tracking
export const useConversionFunnelTracking = () => {
  const trackFunnelStep = (stepName, stepNumber) => {
    trackMetaPixelButtonClick('Funnel Step', `${stepName}_${stepNumber}`);
  };

  const trackFunnelDropoff = (stepName, reason) => {
    trackMetaPixelButtonClick('Funnel Dropoff', `${stepName}_${reason}`);
  };

  const trackFunnelCompletion = (funnelName) => {
    trackMetaPixelButtonClick('Funnel Complete', funnelName);
  };

  return {
    trackFunnelStep,
    trackFunnelDropoff,
    trackFunnelCompletion
  };
}; 
