import { Context, Middleware } from "./deps.ts";

export class Application<RqT, RsT> {
    protected middlewares: Middleware<RqT, RsT>[];
    public constructor() {
        this.middlewares = [];
    }

    public use(...middlewares: Middleware<RqT, RsT>[]){
        this.middlewares.push(...middlewares);
        return this;
    }

    protected makeContext(request: RqT, response: RsT) {
        return new Context<RqT, RsT>(request, response);
    }
}