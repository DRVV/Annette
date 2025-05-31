'use client';

import { useState, useEffect } from 'react';
import { GooglePhotosMediaItem } from '@/types/google-photos';
import PhotoCarousel from '@/components/PhotoCarousel';
import LoginButton from '@/components/LoginButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [photos, setPhotos] = useState<GooglePhotosMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchPhotos();
    
    // Check for authentication errors in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');
    if (urlError) {
      setError(`Authentication failed: ${urlError}`);
      setIsLoading(false);
    }
  }, []);

  const checkAuthAndFetchPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First check if user is authenticated by trying to fetch photos
      const response = await fetch('/api/photos');
      
      if (response.status === 401) {
        // Not authenticated
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const data = await response.json();
      setPhotos(data.mediaItems || []);
      setIsAuthenticated(true);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear cookies by calling a logout endpoint
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setIsAuthenticated(false);
        setPhotos([]);
      })
      .catch(console.error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading your photos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Google Photos Carousel
            </h1>
            <p className="text-gray-600">
              View your recent 50 photos from Google Photos in a beautiful carousel interface.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <LoginButton />
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Secure authentication through Google OAuth 2.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-md p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Google Photos
            </h1>
            <p className="text-gray-600 text-sm">
              {photos.length} photos found
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={checkAuthAndFetchPhotos}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Main content */}
        {photos.length > 0 ? (
          <PhotoCarousel photos={photos} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              No photos found in your Google Photos library.
            </p>
            <button
              onClick={checkAuthAndFetchPhotos}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How to use
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                1
              </span>
              <p>Use the arrow buttons or keyboard arrow keys to navigate</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                2
              </span>
              <p>Click on thumbnails to jump to specific photos</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                3
              </span>
              <p>View photo details and creation dates below each image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
