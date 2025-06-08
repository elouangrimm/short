const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`;

export async function get(key) {
    const url = `${baseUrl}/values/${key}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiToken}` },
    });
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(
            `Cloudflare API Error: ${response.status} ${response.statusText}`
        );
    }
    return response.text();
}

export async function set(key, value) {
    const url = `${baseUrl}/values/${key}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: value,
    });
    if (!response.ok) {
        throw new Error(
            `Cloudflare API Error: ${response.status} ${response.statusText}`
        );
    }
    return true;
}
