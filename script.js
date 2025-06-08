document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const resultDiv = document.getElementById('result');
    const domain = window.location.origin;

    const error = params.get('error');
    const successSlug = params.get('success');

    if (error) {
        resultDiv.style.display = 'block';
        resultDiv.classList.add('error');
        resultDiv.innerText = `Error: ${decodeURIComponent(error)}`;
    } else if (successSlug) {
        const shortUrl = `${domain}/${decodeURIComponent(successSlug)}`;
        resultDiv.style.display = 'block';
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `Successfully created: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const url = document.getElementById('url-input').value;
        const slug = document.getElementById('slug-input').value;
        
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
});