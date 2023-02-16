import { Middleware, Context } from "./deps.ts";

export type HttpMethod = 'HEAD'|'OPTIONS'|'GET'|'PUT'|'PATCH'|'POST'|'DELETE';

export class HttpRequest extends Request {
    public urlParams: Record<string,string> = {};
}

export class HttpResponse {
    public headers: Headers
    public constructor(
        public body?: string,
        public status?: number,
        public statusText?: string,
    ) {
        this.headers = new Headers();
    }
    public response(): Response {
        return new Response(this.body, {
            status : this.status,
            statusText : this.statusText,
            headers : this.headers
        });
    }
}

export type HttpAppServeOpts = Deno.TcpListenOptions;

export class HttpContext extends Context<HttpRequest, HttpResponse> { 
    public constructor(
        request: HttpRequest, 
        response: HttpResponse
    ) {
        super(request, response);
    }
}

export type HttpMiddleware = Middleware<HttpRequest, HttpResponse>;