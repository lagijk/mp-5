// handles the user input of urls
// app/components/url-form.tsx
// code source: https://nextjs.org/docs/pages/building-your-application/data-fetching/forms-and-mutations
"use client";
import { useState, useEffect, FormEvent } from "react";

export default function UrlForm() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [short, setShort] = useState("");
    const [error, setError] = useState("");

    async function onSubmit(event:FormEvent) {
        event.preventDefault()
        setError("");
        setShort("");

        try {
            const result = await fetch("/api/urlData", {
                method: 'POST',
                body: JSON.stringify({url, alias}),
            });

            const data = await result.json()

            // checks if result was valid
            if (!result.ok) {
                setError(data.error || "something went wrong");
                return;
            } 

            // set the short url for display
            setShort(`http://localhost:3000/${alias}`);
    
            
        // error handling
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("An unknown error occurred")
            }
            
        }
       
    };
    // render the UI for shortening url
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                <label>URL</label>
                <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url"
                />
                </div>

                <div>
                <label>Custom Alias</label>
                <input
                    type="text"
                    required
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="your-custom-alias"
                />
                </div>
                
                {error && <p>{error}</p>}

                <button type="submit">Shorten</button>
            </form>

            {short && (
                <div>
                <p>Shortened URL:</p>
                <a href={short} target="_blank">{short}</a>
                </div>
            )}
        </div>
    );
}