import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // The rewrite in vercel.json sends the path here.
  // We need to extract the slug from the URL path.
  const slug = request.nextUrl.pathname.slice(1); // remove the leading '/'

  if (!slug) {
    // If someone just goes to the root, redirect to the main page.
    // This is a fallback; Vercel should serve index.html directly.
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Fetch the long URL from Vercel KV
    const longUrl = await kv.get(slug);

    if (longUrl) {
      // If found, perform a permanent redirect
      return NextResponse.redirect(new URL(longUrl), 308);
    } else {
      // If not found, redirect to the home page with an error
      // (Or you could have a custom 404 page)
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'not-found');
      return NextResponse.redirect(homeUrl);
    }
  } catch (error) {
    console.error('Redirect error:', error);
    // On error, redirect to home
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('error', 'server-error');
    return NextResponse.redirect(homeUrl);
  }
}