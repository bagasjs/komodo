import { Application, Router, Middleware } from "../mod.ts";

const app = new Application();
const router = new Router();

interface User {
  username: string;
  password: string;
}

const logger: Middleware = ( ctx, next ) => { 
  console.log(`[LOG]: "${ctx.request.method}" Request at "${ctx.request.url}"`) 
  if(next) next(ctx);
};

const users: User[] = [];

router.get("/", (ctx) => {
  ctx.response.headers?.set("Content-type", "text/html");
  ctx.response.body = "Hello, World";
});

router.get("/users", (ctx) => {
  ctx.response.body = JSON.stringify(users);
});

router.get("/users/:username", (ctx) => {
  const username = ctx.urlParams["username"];
  ctx.response.headers?.set("Content-type", "text/html");
  ctx.response.body = `<h1> Hello, ${username} </h1>`;
});

app.use(logger);
app.use(router.routes());

app.listen({
  port : 8000,
});