import { NextRequest, NextResponse } from 'next/server';
import { GooglePhotosAPI } from '@/utils/google-photos-api';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch photos from Google Photos API
    const photosResponse = await GooglePhotosAPI.searchPhotos(authToken, 50);
    
    return NextResponse.json(photosResponse);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' }, 
      { status: 500 }
    );
  }
}
