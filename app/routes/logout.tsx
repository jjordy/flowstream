import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
