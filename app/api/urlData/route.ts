// source code from: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// app/api/urlData/route.ts
// route handler for url shortener using mongodb
import getCollection, {POSTS_COLLECTION} from "@/db";

export async function POST(request: Request) {
    try {
        const {url, alias} = await request.json();
        // checks if url and alias is valid first
        if (!url || !alias) {
            return Response.json({ error: "Missing URL or alias"}, {status: 400});
        }
        // checks if url format is valid  
        try {
            const pattern = new URL(url);
            const urlPatterns = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const urlname = pattern.hostname;
            if (!urlPatterns.test(urlname)) {
                return Response.json({error: "Invalid URL format"}, {status: 400});   
            }
            
            // checks if the server exists and can respond by using a fetch request
            try {
                const result = await fetch(url, {method: "HEAD", redirect: "follow"});
                if (!result.ok) {
                    return Response.json({error: "Server Error"}, {status: 400});
                }
            } catch {
                //if the server can't be reached or does not respond, it is invalid
                return Response.json({error: "Invalid URL format"}, {status: 400});
            }
        } catch {
            return Response.json({error: "Invalid URL format"}, {status: 400});
        }

        // connect with MongoDB
        const urlCollection = await getCollection(POSTS_COLLECTION);

        // checks if the alias exists in the database, if yes, ask user to enter a new one
        const data = await urlCollection.findOne({alias});
        if (data) {
            return Response.json({error:"Invalid alias: This alias already exists"}, {status: 400});
        }
        // otherwise insert into database and return success response
        await urlCollection.insertOne({alias, url});
        return Response.json({message: "Shorten URL created!"});

    } catch (err: unknown) {
        let message = "Unknown error";
            if (err instanceof Error) {
                message = err.message;
            }
        return Response.json({error: message});
    }
}