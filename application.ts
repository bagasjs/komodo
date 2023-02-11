import { Context } from "./context.ts"
import { HttpResponseWriter } from "./http_response_writer.ts";
import { composeMiddleware } from "./interface.ts";
import type { AppListenOpts, Middleware } from "./interface.ts";

export class Application {
  private middlewares: Middleware[];

  public constructor() {
    this.middlewares = [];
  }

  public use(...middleware: Middleware[]) {
    this.middlewares.push(...middleware);
    return this;
  }

  public async listen(opts: AppListenOpts) {
    const srv = Deno.listen(opts)

    for await (const conn of srv) {
      const httpConn = Deno.serveHttp(conn);
      for await(const event of httpConn) {
        const handle = composeMiddleware(this.middlewares);
        const response = new HttpResponseWriter();
        const ctx = new Context(event.request, response);
        handle(ctx, (_ctx: Context)=>{});
        event.respondWith(ctx.response.response());
      }
    }
  }
}