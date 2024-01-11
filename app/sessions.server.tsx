import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import { user as userActions } from "../db/data-repositories/user";
// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

import { SessionData, SessionFlashData } from "./types/session";

const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    maxAge: 604_800, // 1 week
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function requireAdminUserSession(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  const user = await userActions.findById(session.get("userId")!);
  if (user?.account_type !== "admin") {
    throw redirect("/");
  }
  return { user, session };
}

export async function userHasSession(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  return { session };
}

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
