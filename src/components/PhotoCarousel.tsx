'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GooglePhotosMediaItem } from '@/types/google-photos';
import { GooglePhotosAPI } from '@/utils/google-photos-api';

interface PhotoCarouselProps {
  photos: GooglePhotosMediaItem[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  }, [photos.length]);

  const goToPhoto = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPhoto, prevPhoto]);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No photos found in your Google Photos library.
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  const photoUrl = GooglePhotosAPI.getPhotoUrl(currentPhoto.baseUrl, 1200, 800);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main photo display */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="relative w-full h-[60vh] min-h-[400px]">
          <Image
            src={photoUrl}
            alt={currentPhoto.filename || 'Photo'}
            fill
            className="object-contain"
            priority
          />
          
          {/* Navigation arrows */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200 backdrop-blur-sm"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200 backdrop-blur-sm"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Photo counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Photo info */}
        <div className="bg-gray-900 text-white p-4">
          <h3 className="font-medium text-lg truncate">
            {currentPhoto.filename || 'Untitled'}
          </h3>
          {currentPhoto.mediaMetadata.creationTime && (
            <p className="text-gray-300 text-sm mt-1">
              Taken on {new Date(currentPhoto.mediaMetadata.creationTime).toLocaleDateString()}
            </p>
          )}
          {currentPhoto.description && (
            <p className="text-gray-300 text-sm mt-2">{currentPhoto.description}</p>
          )}
        </div>
      </div>

      {/* Thumbnail navigation */}
      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => goToPhoto(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              index === currentIndex 
                ? 'border-blue-500 scale-110' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Image
              src={GooglePhotosAPI.getPhotoUrl(photo.baseUrl, 100, 100)}
              alt={photo.filename || 'Thumbnail'}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
