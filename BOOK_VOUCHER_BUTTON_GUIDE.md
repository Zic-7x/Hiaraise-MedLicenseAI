# BookVoucherButton Component Usage Guide

## Overview
The `BookVoucherButton` component is a reusable button that links to the Prometric vouchers page. It can be easily added anywhere in your application to promote voucher sales.

## Import
```javascript
import BookVoucherButton from '../components/BookVoucherButton';
```

## Basic Usage
```javascript
// Simple button
<BookVoucherButton />

// Custom text
<BookVoucherButton>Get Your Voucher</BookVoucherButton>

// Different variants
<BookVoucherButton variant="primary" />
<BookVoucherButton variant="secondary" />
<BookVoucherButton variant="outline" />
<BookVoucherButton variant="ghost" />

// Different sizes
<BookVoucherButton size="sm" />
<BookVoucherButton size="md" />
<BookVoucherButton size="lg" />

// Custom styling
<BookVoucherButton className="my-custom-class" />

// Hide icon
<BookVoucherButton showIcon={false} />

// Link to different page
<BookVoucherButton linkTo="/vouchers" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | Button style variant (`primary`, `secondary`, `outline`, `ghost`) |
| `size` | string | `'md'` | Button size (`sm`, `md`, `lg`) |
| `className` | string | `''` | Additional CSS classes |
| `showIcon` | boolean | `true` | Whether to show the gift icon |
| `children` | string | `'Book Voucher Now'` | Button text content |
| `linkTo` | string | `'/prometric-vouchers'` | Link destination |

## Examples

### In a Hero Section
```javascript
<div className="hero-section">
  <h1>Medical Licensing Made Easy</h1>
  <p>Get your license with our expert assistance</p>
  <BookVoucherButton size="lg" />
</div>
```

### In a Feature Card
```javascript
<div className="feature-card">
  <h3>Save on Exams</h3>
  <p>Get up to 50% off Prometric exam fees</p>
  <BookVoucherButton variant="outline" size="sm" />
</div>
```

### In a Pricing Section
```javascript
<div className="pricing-card">
  <h3>Premium Package</h3>
  <p>Includes exam voucher discounts</p>
  <BookVoucherButton variant="secondary" />
</div>
```

### In Navigation
```javascript
<nav>
  <Link to="/about">About</Link>
  <Link to="/services">Services</Link>
  <BookVoucherButton variant="ghost" size="sm" />
</nav>
```

## Styling Variants

### Primary (Default)
- Green gradient background
- White text
- Hover effects with scale animation

### Secondary
- Blue gradient background
- White text
- Professional look

### Outline
- Transparent background
- Green border and text
- Fills with green on hover

### Ghost
- Semi-transparent background
- White text
- Subtle hover effect

## Integration Examples

### Landing Page Hero
```javascript
<section className="hero">
  <div className="hero-content">
    <h1>Medical Licensing Portal</h1>
    <p>Complete your licensing journey with expert guidance</p>
    <div className="cta-buttons">
      <Link to="/start-license" className="btn-primary">
        Start Your License
      </Link>
      <BookVoucherButton />
    </div>
  </div>
</section>
```

### Services Page
```javascript
<div className="service-card">
  <h3>Exam Preparation</h3>
  <p>We help you prepare for medical licensing exams</p>
  <ul>
    <li>Study materials</li>
    <li>Practice tests</li>
    <li>Exam vouchers</li>
  </ul>
  <BookVoucherButton variant="outline" />
</div>
```

### Footer
```javascript
<footer>
  <div className="footer-content">
    <div className="footer-section">
      <h4>Quick Links</h4>
      <Link to="/about">About Us</Link>
      <Link to="/contact">Contact</Link>
    </div>
    <div className="footer-section">
      <h4>Services</h4>
      <BookVoucherButton variant="ghost" size="sm" />
    </div>
  </div>
</footer>
```

## Best Practices

1. **Placement**: Use the button in prominent locations where users are likely to see it
2. **Context**: Provide context about the voucher system when using the button
3. **Consistency**: Use the same variant throughout your site for consistency
4. **Accessibility**: The button includes proper ARIA attributes and keyboard navigation
5. **Mobile**: The button is responsive and works well on all screen sizes

## Customization

You can customize the button further by:
- Adding custom CSS classes
- Modifying the link destination
- Changing the button text
- Adjusting the icon visibility

The component uses Framer Motion for smooth animations and is fully responsive.
