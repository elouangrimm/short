import { createClient } from "redis";

// We must declare the client outside the handler to reuse the connection
let redisClient;

async function getClient() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL,
        });
        await redisClient.connect();
    }
    return redisClient;
}

export default async function handler(request, response) {
    try {
        const client = await getClient(); // <-- We get the 'client' here
        const host = request.headers.host || "localhost";
        const proto = /^localhost(:\d+)?$/.test(host) ? "http" : "https";
        const fullUrl = new URL(request.url, `${proto}://${host}`);
        const slug = fullUrl.pathname.slice(1);

        if (!slug) {
            return response.redirect(307, "/");
        }

        const longUrl = await client.get(slug); // <-- FIX: Use 'client' not 'kv'

        if (longUrl) {
            return response.redirect(308, longUrl);
        } else {
            const homeUrl = new URL("/", fullUrl.origin);
            homeUrl.searchParams.set(
                "error",
                `The slug "${slug}" was not found.`
            );
            return response.redirect(307, homeUrl.toString());
        }
    } catch (error) {
        console.error("Redirect error:", error);
        // A small improvement here to avoid errors if referer is missing
        const homeUrl = new URL("/", `http://${request.headers.host}`);
        homeUrl.searchParams.set("error", "A server error occurred.");
        return response.redirect(307, homeUrl.toString());
    }
}
