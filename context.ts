import  { HttpResponseWriter } from "./http_response_writer.ts";

export class Context {
    public urlParams: Record<string, string>;
    public constructor(
        public request: Request,
        public response: HttpResponseWriter,
    ){
        this.urlParams = {};
    }
}