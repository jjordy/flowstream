import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import dashboard from "./features/dashboard/routes";
import signIn from "./features/sign-in/routes";
import flows from "./features/flows/routes";
import { jsxRenderer } from "hono/jsx-renderer";
import { Layout } from "./components/layout";
import { deleteCookie } from "hono/cookie";
import admin from "./features/admin/routes";

const app = new Hono();

app.use(`/public/*`, serveStatic({ root: "./" }));

app.all(
  "/*",
  jsxRenderer(({ children }) => {
    return <Layout>{children}</Layout>;
  }),
);
/**
 * User Routes
 * */
app.route("/", dashboard);
app.route("/sign-in", signIn);
app.get("/sign-out", (c) => {
  deleteCookie(c, "authenticated");
  return c.redirect("/sign-in");
});
app.route("/flows", flows);
/**
 * Admin Routes
 * */
app.route("/admin", admin);
//TODO: Use Cloudflare workers & wrangler ??
serve(app);
console.log("\x1b[44m", "App listening @ localhost:3000");
