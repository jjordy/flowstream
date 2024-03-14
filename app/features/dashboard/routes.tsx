import { Hono } from "hono";
import { getSignedCookie } from "hono/cookie";
import { Dashboard } from ".";
import { isAuthenticated } from "app/middlewares/isAuthenticated";

const app = new Hono();

app.get("/", isAuthenticated, async (c) => c.render(<Dashboard />));

export default app;
