import { createClient } from '@vercel/kv';

// Manually create the client using your environment variable
const kv = createClient({
  url: process.env.REDIS_URL, // Use the name of your env var
});

export default async function handler(request, response) {
  // Get just the path from the request URL, e.g., /my-slug
  // Using the URL constructor is robust for handling potential query params
  const host = request.headers.host || 'localhost';
  const proto = /^localhost(:\d+)?$/.test(host) ? 'http' : 'https';
  const fullUrl = new URL(request.url, `${proto}://${host}`);
  const slug = fullUrl.pathname.slice(1); // remove the leading '/'

  // If the slug is empty or for a file that exists, don't try to redirect.
  // This check is a safeguard, your vercel.json should already handle it.
  if (!slug) {
     return response.redirect(307, '/');
  }

  try {
    const longUrl = await kv.get(slug);
    
    if (longUrl) {
      // 308 Permanent Redirect is the correct code for a short link
      return response.redirect(308, longUrl);
    } else {
      // If not found, redirect to the home page with an error
      const homeUrl = new URL('/', fullUrl.origin);
      homeUrl.searchParams.set('error', `The slug "${slug}" was not found.`);
      return response.redirect(307, homeUrl.toString());
    }
  } catch (error) {
    console.error('Redirect error:', error);
    // On a server error, also go home
    const homeUrl = new URL('/', fullUrl.origin);
    homeUrl.searchParams.set('error', 'A server error occurred.');
    return response.redirect(307, homeUrl.toString());
  }
}