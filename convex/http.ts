import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);


http.route({
    pathPrefix: '/images/',
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const { url, json } = request
        const { body: { storageId } } = await json();

        console.log(`received request.url ${url}`)
        console.log(`received request.body.storageId ${storageId}`)

        return new Response(null, {
            status: 200,
        });
    })
});

export default http;
