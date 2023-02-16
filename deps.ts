export class Context<RqT, RsT> {
    public readonly request: RqT;
    public readonly response: RsT;
    public constructor(
        request: RqT, 
        writableResponse: RsT
    ) {
        this.request = request;
        this.response = writableResponse;
    }
}

export type Middleware<RqT, RsT> = (ctx: Context<RqT, RsT>, next?: Middleware<RqT, RsT>) => void|Promise<void>;

export function composeMiddleware<RqT, RsT>(middlewares: Middleware<RqT, RsT>[]): Middleware<RqT, RsT> {
    return function (ctx: Context<RqT, RsT>, next?: Middleware<RqT, RsT>): void|Promise<void> {
        let index = -1;
        function dispatch(i: number): Promise<void> {
            if(i <= index) return Promise.reject(new Error("next() called multiple times"));
            index = i;
            let fn = middlewares[i];
            if(i === middlewares.length) {
                fn = next ? next : (_ctx) => {};
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