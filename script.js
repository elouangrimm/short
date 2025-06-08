// file: script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- All variables are defined here, in the same scope ---
    const form = document.getElementById('shorten-form');
    const resultDiv = document.getElementById('result');
    const domain = window.location.origin;
    const params = new URLSearchParams(window.location.search);

    // --- Part 1: Handle messages from redirects (like from the Chrome Search) ---
    const error = params.get('error');
    const successSlug = params.get('success');

    if (error) {
        resultDiv.style.display = 'block';
        resultDiv.classList.add('error');
        // Sanitize the error message slightly before displaying
        resultDiv.innerText = `Error: ${decodeURIComponent(error.replace(/\+/g, ' '))}`;
    } else if (successSlug) {
        const shortUrl = `${domain}/${decodeURIComponent(successSlug)}`;
        resultDiv.style.display = 'block';
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `Successfully created: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    }

    // --- Part 2: Handle the form submission ---
    // Check if the form actually exists on the page before adding a listener
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const url = document.getElementById('url-input').value;
            const slug = document.getElementById('slug-input').value;

            // Clear previous results
            resultDiv.style.display = 'none';
            resultDiv.className = '';

            try {
                const response = await fetch('/api/create-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url, slug }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }

                const shortUrl = `${domain}/${data.slug}`;
                resultDiv.classList.add('success');
                resultDiv.innerHTML = `Success! Your short link is: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;

            } catch (error) {
                resultDiv.classList.add('error');
                resultDiv.innerHTML = `Error: ${error.message}`;
            }

            resultDiv.style.display = 'block';
        });
    }
});