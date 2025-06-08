import { Redis } from '@upstash/redis';

// Create the Redis client directly from our specific environment variable
const kv = new Redis({
  url: process.env.REDIS_URL,
  // The token is parsed from the URL automatically by the Redis client
});

// The rest of the file stays exactly the same
function generateSlug() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';
    for (let i = 0; i < 6; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { url, slug: customSlug } = request.body;

        if (!url) {
            return response.status(400).json({ message: 'URL is required' });
        }
        
        const slug = customSlug || generateSlug();

        if (!/^[a-zA-Z0-9-]{3,}$/.test(slug)) {
            return response.status(400).json({ message: 'Custom slug must be at least 3 characters and can only contain letters, numbers, and dashes.' });
        }

        const existingUrl = await kv.get(slug);
        if (existingUrl) {
            return response.status(409).json({ message: `Slug "${slug}" is already in use.` });
        }

        await kv.set(slug, url);

        return response.status(200).json({ slug: slug, url: url });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
}