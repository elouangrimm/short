document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("shorten-form");
    const urlInput = document.getElementById("url-input");
    const submitButton = document.getElementById("submit-button");
    const resultDiv = document.getElementById("result");
    const domain = window.location.origin;

    urlInput.focus();

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const successSlug = params.get("success");

    if (error) {
        resultDiv.style.display = "block";
        resultDiv.classList.add("error");
        resultDiv.innerText = `Error: ${decodeURIComponent(
            error.replace(/\+/g, " ")
        )}`;
    } else if (successSlug) {
        const shortUrl = `${domain}/${decodeURIComponent(successSlug)}`;
        resultDiv.style.display = "block";
        resultDiv.classList.add("success");
        resultDiv.innerHTML = `Successfully created: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    }

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = "Creating...";

            resultDiv.style.display = "none";
            resultDiv.className = "";

            try {
                const url = urlInput.value;
                const slug = document.getElementById("slug-input").value;

                const response = await fetch("/api/create-link", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url, slug }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong");
                }

                const shortUrl = `${domain}/${data.slug}`;
                resultDiv.classList.add("success");

                let successMessage = `Success! Your link is: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;

                try {
                    await navigator.clipboard.writeText(shortUrl);
                    successMessage += " (Copied to clipboard!)";
                } catch (copyError) {
                    console.error("Failed to copy to clipboard:", copyError);
                    successMessage += " (Couldn't auto-copy)";
                }

                resultDiv.innerHTML = successMessage;
            } catch (error) {
                resultDiv.classList.add("error");
                resultDiv.innerHTML = `Error: ${error.message}`;
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                resultDiv.style.display = "block";
            }
        });
    }
});
