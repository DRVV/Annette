export interface GooglePhotosMediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
      exposureTime?: string;
    };
  };
  contributorInfo?: {
    profilePictureBaseUrl: string;
    displayName: string;
  };
  filename: string;
}

export interface GooglePhotosResponse {
  mediaItems: GooglePhotosMediaItem[];
  nextPageToken?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  user: {
    name?: string;
    email?: string;
    picture?: string;
  } | null;
}
