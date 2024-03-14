import { getSignedCookie } from "hono/cookie";
import { useRequestContext } from "hono/jsx-renderer";

export async function useIsAuthenticated({ redirect = false } = {}) {
  const c = useRequestContext();
  const cookie = await getSignedCookie(c, "a8sdfas9fd9");
  if (cookie?.authenticated) {
    return cookie.authenticated as string;
  }
  if (redirect) {
    c.redirect("/sign-in");
  }
  return null;
}
