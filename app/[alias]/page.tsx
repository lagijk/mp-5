// app/[alias]/page.tsx
// based on discussion code
// code source: https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function

import getCollection, {POSTS_COLLECTION} from "@/db";
import { redirect } from "next/navigation";

export default async function AliasPage({params}: {params: Promise<{alias: string}>}) {
    const {alias} = await params;
    try {
        // connect to mongodb and search for alias
        const collection = await getCollection(POSTS_COLLECTION);
        const result = await collection.findOne({alias});
        // if alias is not found return to home page
        if (result === null) {
            return redirect("/");
        }
        console.log("Redirecting to:", result.url);
        // otherwise redirect to original long url
        return redirect(result.url); 
      
    } catch (err) {
        // error handling
        console.error(err);
        return redirect("/"); 
    }
    
}