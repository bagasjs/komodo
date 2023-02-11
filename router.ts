import { Context } from "./context.ts";
import { composeMiddleware } from "./interface.ts";
import type { Middleware, HttpMethod } from "./interface.ts";

export class Router {
    private middlewares: Middleware[];

    public constructor() {
        this.middlewares = [];
    }

    public routes(): Middleware {
        return composeMiddleware(this.middlewares);
    }

    public match(methods: HttpMethod[], path: string, handler: Middleware) {
        this.middlewares.push((ctx: Context, next?: Middleware) => {
            const url = new URL(ctx.request.url);
            const pattern = new URLPattern(path, url.origin);
            if(methods.includes(ctx.request.method as HttpMethod) && pattern.test(url)) {
                const res = pattern.exec(url);
                if(res?.pathname.groups) ctx.urlParams = res?.pathname.groups;
                return handler(ctx, next);
            }
            if(next) next(ctx);
        });
        return this;
    }

    public get(path: string, handler: Middleware) {
        return this.match(["GET"], path, handler);
    }

    public post(path: string, handler: Middleware) {
        return this.match(["POST"], path, handler);
    }

    public put(path: string, handler: Middleware) {
        return this.match(["PUT"], path, handler);
    }

    public delete(path: string, handler: Middleware) {
        return this.match(["DELETE"], path, handler);
    }

    public all(path: string, handler: Middleware) {
        return this.match([ 'HEAD','OPTIONS','GET','PUT','PATCH','POST','DELETE' ], path, handler);
    }
}