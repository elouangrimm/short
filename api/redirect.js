import { get } from '../lib/kv.js';

export default async function handler(request, response) {
    try {
        const host = request.headers.host || 'localhost';
        const proto = /^localhost(:\d+)?$/.test(host) ? 'http' : 'https';
        const fullUrl = new URL(request.url, `${proto}://${host}`);
        const slug = fullUrl.pathname.slice(1);

        if (!slug) {
            return response.redirect(307, '/');
        }

        const longUrl = await get(slug);
        
        if (longUrl) {
            return response.redirect(308, longUrl);
        } else {
            const homeUrl = new URL('/', fullUrl.origin);
            homeUrl.searchParams.set('error', `The slug "${slug}" was not found.`);
            return response.redirect(307, homeUrl.toString());
        }
    } catch (error) {
        console.error('Redirect error:', error);
        const homeUrl = new URL('/', `http://${request.headers.host}`);
        homeUrl.searchParams.set('error', 'A server error occurred.');
        return response.redirect(307, homeUrl.toString());
    }
}