// app/[alias]/route.ts
// route handler that runs on the server only, which allows us to redirect to external urls
// based on discussion code
// code source: https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function

import getCollection, {POSTS_COLLECTION} from "@/db";
import {NextResponse, NextRequest} from "next/server";

export async function GET(request: NextRequest, context: {params: {alias:string}}) {
    
    try {
        // connect to mongodb and search for alias
        const collection = await getCollection(POSTS_COLLECTION);
        const result = await collection.findOne({alias: context.params.alias});
        // if alias is not found return to home page
        if (result === null) {
            return NextResponse.redirect("/");
        }
        console.log("Redirecting to:", result.url);
        // otherwise redirect to original long url
        return NextResponse.redirect(result.url); 
      
    } catch (err) {
        // error handling
        console.error(err);
        return NextResponse.redirect("/"); 
    }
    
}