import { Application } from "./application.ts";
import { composeMiddleware } from "./deps.ts";
import { HttpRequest, HttpResponse, HttpAppServeOpts } from "./http_interface.ts";

export class HttpApplication extends Application<HttpRequest, HttpResponse> {
    public async serve(opts: HttpAppServeOpts) {
        const srv = Deno.listen(opts)

        for await (const conn of srv) {
            const httpConn = Deno.serveHttp(conn);
            for await(const event of httpConn) {
                const handle = composeMiddleware(this.middlewares);
                const request = event.request as HttpRequest;
                const response = new HttpResponse();
                const ctx = this.makeContext(request, response);
                handle(ctx);
                event.respondWith(ctx.response.response());
            }
        }
    }
}