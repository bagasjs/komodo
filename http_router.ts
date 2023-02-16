import { composeMiddleware } from "./deps.ts";
import type { HttpContext, HttpMethod, HttpMiddleware } from "./http_interface.ts";

export class HttpRouter {
    private middlewares: HttpMiddleware[];

    public constructor() {
        this.middlewares = [];
    }

    public routes(): HttpMiddleware {
        return composeMiddleware(this.middlewares);
    }

    public match(methods: HttpMethod[], path: string, handler: HttpMiddleware) {
        this.middlewares.push((ctx: HttpContext, next?: HttpMiddleware) => {
            const url = new URL(ctx.request.url);
            const pattern = new URLPattern(path, url.origin);
            if(methods.includes(ctx.request.method as HttpMethod) && pattern.test(url)) {
                const res = pattern.exec(url);
                if(res?.pathname.groups) ctx.request.urlParams = res?.pathname.groups;
                return handler(ctx, next);
            }
            if(next) next(ctx);
        });
        return this;
    }

    public get(path: string, handler: HttpMiddleware) {
        return this.match(["GET"], path, handler);
    }

    public post(path: string, handler: HttpMiddleware) {
        return this.match(["POST"], path, handler);
    }

    public put(path: string, handler: HttpMiddleware) {
        return this.match(["PUT"], path, handler);
    }

    public delete(path: string, handler: HttpMiddleware) {
        return this.match(["DELETE"], path, handler);
    }

    public all(path: string, handler: HttpMiddleware) {
        return this.match([ 'HEAD','OPTIONS','GET','PUT','PATCH','POST','DELETE' ], path, handler);
    }
}