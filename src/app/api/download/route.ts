// app/api/image/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract the image URL from the search parameters
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
  }

  try {
    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }

    // Use the response body directly as a stream
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    // const contentLength = response.headers.get('Content-Length') || '';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    // headers.set('Content-Length', contentLength);

    // Set CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', '*');

    return new NextResponse(response.body, {
      headers: headers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  // Preflight CORS response
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  return new NextResponse(null, {
    headers: headers,
  });
}
