# Medical License Portal

A comprehensive web application for managing medical license applications and case tracking.

## Project Structure

```
med-license-portal/
├── frontend/          # React.js frontend application
├── backend/           # Node.js backend server
├── supabase/          # Database migrations and schema
└── docs/             # Documentation
```

## Features

- User authentication and authorization
- Case submission and tracking
- Payment processing
- Admin dashboard with analytics
- Multi-country support
- Real-time notifications

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Supabase Client
- React Router

### Backend
- Node.js
- Express.js
- Supabase (Database & Auth)

### Database
- PostgreSQL (via Supabase)
- Real-time subscriptions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd med-license-portal
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in your Supabase credentials and other required variables

4. Run the development servers:
```bash
# Frontend (from frontend directory)
npm start

# Backend (from backend directory)
npm run dev
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
```

## Database Setup

1. Run Supabase migrations:
```bash
cd supabase
supabase db push
```

## Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar

### Backend
- Deploy to Heroku, Railway, or similar
- Set environment variables in deployment platform

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license information here]

## Support

For support, email [your-email] or create an issue in the repository. 