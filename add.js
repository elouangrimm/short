document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (!query) {
        window.location.href = '/?error=no-query-from-add';
        return;
    }
    
    // Split the query by space. Eg: "https://google.com my-link"
    const parts = query.trim().split(/\s+/);
    const url = parts[0];
    const slug = parts[1] || ''; // Slug is optional

    try {
        const response = await fetch('/api/create-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, slug }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            // Redirect to home with the error message
            window.location.href = `/?error=${encodeURIComponent(data.message)}`;
        } else {
            // Redirect to home with a success message
            window.location.href = `/?success=${encodeURIComponent(data.slug)}`;
        }

    } catch (error) {
        window.location.href = `/?error=${encodeURIComponent(error.message)}`;
    }
});