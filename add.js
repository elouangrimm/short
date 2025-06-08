document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (!query) {
        window.location.href = "/?error=no-query-from-add";
        return;
    }

    const parts = query.trim().split(/\s+/);
    let url = parts[0];
    const slug = parts[1] || "";

    function getValidUrl(string) {
        try {
            new URL(string);
            return string;
        } catch (_) {
            try {
                const urlWithProtocol = `https://${string}`;
                new URL(urlWithProtocol);
                return urlWithProtocol;
            } catch (__) {
                return null;
            }
        }
    }

    const validUrl = getValidUrl(url);

    if (!validUrl) {
        const errorMessage = `The URL you provided is invalid: "${url}"`;
        window.location.href = `/?error=${encodeURIComponent(errorMessage)}`;
        return;
    }

    try {
        const response = await fetch("/api/create-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: validUrl, slug }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            const message = data?.message || "An unknown server error occurred.";
            throw new Error(message);
        }
        
        const data = await response.json();
        window.location.href = `/?success=${encodeURIComponent(data.slug)}`;

    } catch (error) {
        window.location.href = `/?error=${encodeURIComponent(error.message)}`;
    }
});