export default function handler(request, response) {
  // Get the value of your environment variable
  const redisUrl = process.env.REDIS_URL;

  // Get ALL environment variable keys that are available to the function
  const allEnvKeys = Object.keys(process.env);

  // Send this information back as a JSON response
  response.status(200).json({
    message: "Vercel Environment Variable Debug",
    // --- Check this section ---
    isRedisUrlDefined: !!redisUrl,
    redisUrlValue: redisUrl || "Not Found",
    redisUrlType: typeof redisUrl,
    // --- This is the most important part ---
    allAvailableEnvKeys: allEnvKeys,
  });
}