# Annette: simple Google Photos Carousel Viewer

A simple web application that displays your recent 50 photos from Google Photos in an interactive carousel interface.

## Features

- 🔐 **Secure Google OAuth 2.0 Authentication** - Login with your Google account (no profile data required)
- 📸 **Recent Photos Display** - Shows your latest 50 photos from Google Photos
- 🎠 **Interactive Carousel** - Navigate with arrow buttons, keyboard, or thumbnails
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Fast Loading** - Optimized image loading with Next.js Image component
- 🎨 **Modern UI** - Clean design with Tailwind CSS
- 🔒 **Privacy-Focused** - Only accesses photos, no personal information needed

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Google Cloud Project with Photos Library API enabled
- Google OAuth 2.0 credentials configured

## Google Cloud Setup

1. **Create a Google Cloud Project** (if you don't have one):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable the Photos Library API**:
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Photos Library API" and enable it
   - Note: Google+ API is NOT required

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback`
   - Note down your Client ID and Client Secret

## Installation

1. **Clone and navigate to the project**:
   ```bash
   cd google-photos-carousel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local`** with your Google OAuth credentials:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Authentication**: Click "Sign in with Google" to authenticate with your Google account
2. **Browse Photos**: Use the carousel to view your recent 50 photos
3. **Navigation**: 
   - Click arrow buttons to navigate
   - Use keyboard arrow keys (← →)
   - Click thumbnail images to jump to specific photos
4. **Photo Info**: View filename and creation date below each photo
5. **Logout**: Use the logout button in the top-right corner

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts    # OAuth callback handler
│   │   │   └── logout/route.ts      # Logout endpoint
│   │   └── photos/route.ts          # Photos API endpoint
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main page component
├── components/
│   ├── PhotoCarousel.tsx            # Carousel component
│   ├── LoginButton.tsx              # Google sign-in button
│   └── LoadingSpinner.tsx           # Loading indicator
├── types/
│   └── google-photos.ts             # TypeScript interfaces
└── utils/
    └── google-photos-api.ts         # Google Photos API utility
```

## Key Components

### PhotoCarousel
- Displays photos in a responsive carousel
- Supports keyboard navigation
- Shows photo metadata and thumbnails
- Handles image optimization

### Authentication Flow
- Manual OAuth 2.0 implementation (no third-party auth libraries)
- Secure cookie-based session management
- Automatic token refresh handling
- Only requests access to photos (no user profile data)

### API Integration
- Direct integration with Google Photos Library API
- Fetches recent photos with proper filtering
- Error handling and retry logic

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Google Photos Library API** - Photo data access
- **Google OAuth 2.0** - Authentication

## Security Features

- HTTP-only cookies for token storage
- Secure session management
- CSRF protection through SameSite cookies
- Environment variable protection for secrets

## Troubleshooting

### Common Issues

1. **"Failed to fetch photos" error**:
   - Ensure Photos Library API is enabled in Google Cloud Console
   - Check that your OAuth credentials are correct
   - Verify the redirect URI matches exactly

2. **Authentication errors**:
   - Make sure redirect URI is added to your OAuth configuration
   - Check that client ID and secret are properly set in `.env.local`

3. **No photos showing**:
   - Verify you have photos in your Google Photos library
   - Check browser console for any error messages
   - Try refreshing the authentication

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Project configuration
3. Ensure all environment variables are properly set

## License

This project is open source and available under the [MIT License](LICENSE).
