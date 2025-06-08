const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`;

// Function to read a value from KV
export async function get(key) {
  const url = `${baseUrl}/values/${key}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiToken}` },
  });
  if (!response.ok) {
    // If the key doesn't exist, Cloudflare returns a 404. We'll treat this as 'null'.
    if (response.status === 404) return null;
    throw new Error(`Cloudflare API Error: ${response.status} ${response.statusText}`);
  }
  // The value is the raw response body
  return response.text();
}

// Function to write a value to KV
export async function set(key, value) {
  const url = `${baseUrl}/values/${key}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${apiToken}` },
    body: value,
  });
  if (!response.ok) {
    throw new Error(`Cloudflare API Error: ${response.status} ${response.statusText}`);
  }
  return true;
}