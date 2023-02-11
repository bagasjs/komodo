import { Context } from "./context.ts";

export type AppListenOpts = Deno.TcpListenOptions;
export type Middleware = (ctx: Context, next?: Middleware) => Promise<void>|void;
export type HttpMethod = 'HEAD'|'OPTIONS'|'GET'|'PUT'|'PATCH'|'POST'|'DELETE';

export const emptyMiddleware: Middleware = (_ctx) => {};

export function composeMiddleware(middlewares: Middleware[]): Middleware {
    return function(ctx: Context, next?: Middleware): Promise<void>|void {
        let index = -1;
        function dispatch(i: number): Promise<void> {
            if(i <= index) return Promise.reject(new Error("next() called multiple times"));
            index = i;
            let fn = middlewares[i];
            
            if(i === middlewares.length) {
                fn = next ? next : emptyMiddleware;
            }

            if(!fn) return Promise.resolve();
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i+1)));
            } catch(err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}