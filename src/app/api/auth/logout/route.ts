import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true });
    
    // Clear all authentication cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_info');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' }, 
      { status: 500 }
    );
  }
}
