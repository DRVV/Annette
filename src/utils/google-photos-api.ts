import { GooglePhotosResponse, AuthTokens } from '@/types/google-photos';

const GOOGLE_PHOTOS_API_BASE = 'https://photoslibrary.googleapis.com/v1';
const GOOGLE_AUTH_BASE = 'https://accounts.google.com/oauth2/v2';

export class GooglePhotosAPI {
  private static readonly CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  private static readonly CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  private static readonly REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/photoslibrary.readonly'
  ];

  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: this.SCOPES.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange error:', response.status, errorText);
      throw new Error(`Failed to exchange code for tokens: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  static async getRecentPhotos(accessToken: string, pageSize: number = 50): Promise<GooglePhotosResponse> {
    const url = new URL(`${GOOGLE_PHOTOS_API_BASE}/mediaItems`);
    url.searchParams.append('pageSize', pageSize.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch photos: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  static async searchPhotos(accessToken: string, pageSize: number = 50): Promise<GooglePhotosResponse> {
    const requestBody = {
      pageSize,
      filters: {
        mediaTypeFilter: {
          mediaTypes: ['PHOTO']
        }
      }
    };

    const response = await fetch(`${GOOGLE_PHOTOS_API_BASE}/mediaItems:search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search photos: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  static getPhotoUrl(baseUrl: string, width: number = 800, height: number = 600): string {
    return `${baseUrl}=w${width}-h${height}`;
  }
}
