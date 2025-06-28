# Google Analytics Setup Guide

This document outlines the Google Analytics implementation for the Hiaraise medical licensing portal.

## Overview

Google Analytics has been integrated into the application to track user behavior, page views, conversions, and other important metrics. The implementation includes:

- **Page View Tracking**: Automatic tracking of all page views
- **Event Tracking**: Custom events for user interactions
- **Form Analytics**: Form submissions and field interactions
- **User Engagement**: Scroll depth, time on page, and modal interactions
- **Business Metrics**: Case submissions, payments, and conversions

## Setup Components

### 1. Google Analytics Script (index.html)

The Google Analytics tracking code has been added to `public/index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BFD5H9R73Z"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-BFD5H9R73Z');
</script>
```

### 2. Analytics Utilities (`src/utils/analytics.js`)

Core analytics functions for tracking various events:

- `trackPageView(url)` - Track page views
- `trackEvent(action, category, label, value)` - Track custom events
- `trackFormSubmission(formName)` - Track form submissions
- `trackButtonClick(buttonName, location)` - Track button clicks
- `trackLogin(method)` - Track user logins
- `trackRegistration(method)` - Track user registrations
- `trackCaseSubmission(country)` - Track case submissions
- `trackPayment(amount, currency)` - Track payments
- And many more...

### 3. Analytics Hooks (`src/utils/useAnalytics.js`)

React hooks for automatic tracking:

- `useAnalytics()` - Automatic page view and behavior tracking
- `useFormAnalytics(formName)` - Form interaction tracking
- `useEngagementAnalytics()` - User engagement tracking

### 4. App Integration (`src/App.js`)

The main App component includes an `AnalyticsTracker` component that automatically tracks:
- Page views on route changes
- Time spent on each page
- Scroll depth (25%, 50%, 75%, 100%)

## Tracked Events

### Page Views
- All page views are automatically tracked
- Includes route changes and search parameters

### User Authentication
- Login attempts (success/failure)
- Registration completions
- Password reset requests

### Form Interactions
- Form starts (when user begins filling)
- Field focus/blur events
- Form submissions
- Form errors

### Business Events
- Case submissions (with country)
- Payment completions
- Document uploads
- Country selections

### User Engagement
- Button clicks
- Modal interactions
- Chat widget usage
- External link clicks
- Scroll depth tracking
- Time on page

### Navigation
- Welcome modal interactions
- Step-by-step navigation
- Direct step jumps

## Implementation Examples

### Basic Event Tracking

```javascript
import { trackEvent, trackButtonClick } from '../utils/analytics';

// Track a custom event
trackEvent('video_play', 'engagement', 'welcome_video');

// Track button click
trackButtonClick('submit_case', 'dashboard');
```

### Form Tracking

```javascript
import { useFormAnalytics } from '../utils/useAnalytics';

function MyForm() {
  const { trackFormStart, trackFormFieldInteraction } = useFormAnalytics('my_form');
  
  useEffect(() => {
    trackFormStart(); // Track when form is loaded
  }, [trackFormStart]);
  
  const handleFieldFocus = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'focus');
  };
  
  // Use in input fields
  <input 
    onFocus={() => handleFieldFocus('email')}
    onBlur={() => trackFormFieldInteraction('email', 'blur')}
  />
}
```

### Automatic Page Tracking

```javascript
import { useAnalytics } from '../utils/useAnalytics';

function MyPage() {
  useAnalytics(); // Automatically tracks page views, scroll depth, time on page
  return <div>My Page Content</div>;
}
```

## Google Analytics Dashboard

### Key Metrics to Monitor

1. **Traffic Sources**
   - Direct traffic
   - Organic search
   - Referral traffic
   - Social media

2. **User Behavior**
   - Page views per session
   - Average session duration
   - Bounce rate
   - Exit pages

3. **Conversions**
   - Registration completions
   - Case submissions
   - Payment completions
   - Form submissions

4. **User Engagement**
   - Scroll depth
   - Time on page
   - Button click rates
   - Modal interaction rates

### Custom Reports

Create custom reports in Google Analytics for:

1. **Conversion Funnel**
   - Landing page → Registration → Login → Case Submission → Payment

2. **User Journey**
   - Track user paths through the application

3. **Country-specific Analytics**
   - Performance by target country (Saudi Arabia, UAE, Qatar)

4. **Form Performance**
   - Form completion rates
   - Field interaction patterns
   - Error rates

## Privacy Considerations

### GDPR Compliance

- Analytics data is anonymized
- No personally identifiable information is tracked
- Users can opt-out through browser settings

### Data Retention

- Google Analytics data retention is set to 26 months
- Consider implementing data deletion requests

## Troubleshooting

### Common Issues

1. **Events not showing in GA**
   - Check browser console for errors
   - Verify tracking ID is correct
   - Ensure gtag is loaded before tracking

2. **Page views not tracking**
   - Verify React Router integration
   - Check for JavaScript errors
   - Ensure AnalyticsTracker component is mounted

3. **Custom events missing**
   - Check event parameters
   - Verify gtag function availability
   - Test in browser console

### Debug Mode

Enable debug mode for testing:

```javascript
// Add to analytics.js for development
if (process.env.NODE_ENV === 'development') {
  console.log('Analytics Event:', { action, category, label, value });
}
```

## Best Practices

1. **Event Naming**
   - Use consistent naming conventions
   - Be descriptive but concise
   - Use lowercase with underscores

2. **Category Organization**
   - engagement: User interactions
   - business: Revenue-related events
   - ecommerce: Payment events
   - form: Form-related events

3. **Testing**
   - Test all events in development
   - Verify data in Google Analytics
   - Monitor for missing events

4. **Performance**
   - Use passive event listeners
   - Debounce scroll events
   - Avoid tracking on every keystroke

## Future Enhancements

1. **Enhanced E-commerce**
   - Product impressions
   - Add to cart events
   - Purchase funnels

2. **User Segmentation**
   - Track user types (new vs returning)
   - Country-based segmentation
   - Behavior-based segments

3. **A/B Testing Integration**
   - Track experiment variations
   - Conversion rate comparisons

4. **Real-time Analytics**
   - Live user tracking
   - Real-time conversion monitoring

## Support

For questions or issues with Google Analytics implementation:

1. Check Google Analytics documentation
2. Review browser console for errors
3. Verify tracking code implementation
4. Test with Google Analytics Debugger extension 