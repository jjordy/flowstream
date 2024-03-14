import { Next, Context, MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";

export const isAuthenticated: MiddlewareHandler<{
  Variables: { user: string };
}> = async (c, next) => {
  const cookie = await getSignedCookie(c, "a8sdfas9fd9");
  if (cookie?.authenticated) {
    c.set("user", cookie.authenticated);
    return await next();
  }
  return c.redirect("/sign-in");
};
