// app/[alias]/page.tsx
// based on discussion code
// code source: https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function

import getCollection, {POSTS_COLLECTION} from "@/db";
import { redirect } from "next/navigation";

export default async function Page({params}: {params: {alias: string}}) {
    
    try {
        // connect to mongodb and search for alias
        const collection = await getCollection(POSTS_COLLECTION);
        const result = await collection.findOne({alias: params.alias});
        // if alias is not found return to home page
        if (result === null) {
            redirect("/");
        }
        console.log("Redirecting to:", result.url);
        // otherwise redirect to original long url
        redirect(result.url); 
      
    } catch (err) {
        // error handling
        console.error(err);
        redirect("/"); 
    }
    
}