export class HttpResponseWriter {
    public headers?: Headers
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