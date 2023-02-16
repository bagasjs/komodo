import { HttpApplication as Application, HttpRouter as Router } from "../mod.ts";

const app = new Application();
const router = new Router();


router.get("/", (ctx) => {
  ctx.response.headers.set("Content-type", "text/html");
  ctx.response.body = "<h1> Welcome to my website </h1>";
})

app.use(router.routes());

app.serve({
  port : 8000
});