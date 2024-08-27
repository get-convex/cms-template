import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);


http.route({
    path: '/images/upload',
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const { body: { storageId } } = await request.json();

        console.log(`received request.body.storageId ${storageId}`)

        return new Response(null, {
            status: 200,
        });
    })
});

export default http;
