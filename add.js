document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (!query) {
        window.location.href = "/?error=no-query-from-add";
        return;
    }

    const parts = query.trim().split(/\s+/);
    const url = parts[0];
    const slug = parts[1] || "";

    function isValidUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return true
    }

    if !isValidUrl(url) {
        window.location.href = `/?error=${encodeURIComponent("The URL you provided is invalid.")}`;
    } 

    try {
        const response = await fetch("/api/create-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, slug }),
        });

        const data = await response.json();

        if (!response.ok) {
            window.location.href = `/?error=${encodeURIComponent(
                data.message
            )}`;
        } else {
            window.location.href = `/?success=${encodeURIComponent(data.slug)}`;
        }
    } catch (error) {
        window.location.href = `/?error=${encodeURIComponent(error.message)}`;
    }
});
