import { NextRequest, NextResponse } from 'next/server';
import { GooglePhotosAPI } from '@/utils/google-photos-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=' + error, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange authorization code for tokens
    console.log('Exchanging code for tokens...');
    const tokens = await GooglePhotosAPI.exchangeCodeForTokens(code);
    console.log('Tokens received:', { 
      access_token: tokens.access_token ? tokens.access_token.substring(0, 20) + '...' : 'none',
      refresh_token: tokens.refresh_token ? 'present' : 'none',
      expires_in: tokens.expires_in
    });
    
    // Create response and set secure cookies
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set authentication cookies
    response.cookies.set('auth_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in
    });
    
    if (tokens.refresh_token) {
      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
