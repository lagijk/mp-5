// handles the user input of urls and displays the front end page
// app/components/url-form.tsx
// code source: https://nextjs.org/docs/pages/building-your-application/data-fetching/forms-and-mutations
// material ui icon source: https://mui.com/material-ui/material-icons/
"use client";
import { useState, FormEvent } from "react";
import {Box, Button, Paper, IconButton, Typography, TextField} from "@mui/material";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckIcon from '@mui/icons-material/Check';

export default function UrlForm() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [short, setShort] = useState("");
    const [error, setError] = useState("");
    const [copy, setCopy] = useState(false); 

    // allow user to copy link
    const copyHandler = () => {
        navigator.clipboard.writeText(short);
        setCopy(true);
    };

    async function onSubmit(event:FormEvent) {
        event.preventDefault()
        setError("");
        setShort("");

        // prevent user from using the same link as the url shortener
        if (url.startsWith(window.location.origin)) {
            setError("Invalid URL: Cycled URL are not allowed!")
            return;
        }

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
            // uses window.location.origin so don't need to hardcode url after deployment
            setShort(`${window.location.origin}/${alias}`);
            
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
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>

            <form onSubmit={onSubmit}>
                <Box mb={3}>
                    <Typography variant="h5" fontWeight="bold">URL</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Please enter a long URL to create a shorter link.
                    </Typography>
                        
                    <TextField
                        type="url"
                        required
                        value={url}
                        fullWidth
                        size="medium"
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/very/long/url"
                    />
                </Box>

                <Box mb={3}>
                    <Typography variant="h5" fontWeight="bold">Custom Alias</Typography>
                    <TextField
                        type="text"
                        required
                        value={alias}
                        fullWidth
                        size="medium"
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="your-custom-alias"
                    />
                </Box>

                {error && <Typography color="error" mt={1}>{error}</Typography>}

                <Button type="submit" variant="contained" color="success" fullWidth sx={{mt: 2}}>
                    Shorten
                </Button>
            </form>

            {short && (
                <Paper elevation={3} sx={{mt: 4, p: 2, textAlign: "center", backgroundColor: "#9DC08B", borderRadius: 2,}}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Shortened URL:
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <Typography variant="body1" color="primary">
                            <a href={short} target="_blank">{short}</a>
                        </Typography>
                        <IconButton onClick={copyHandler} color="primary">
                            {copy ? <CheckIcon /> : <ContentCopyRoundedIcon />}
                        </IconButton>
                    </Box>
                </Paper>
            )}

        </Paper>
    );
}