import { Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { UserService } from "services/user";
import { SignIn } from ".";
import { AppContext } from "app/context";
import { Layout } from "app/components/layout";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.parseBody();
  const user = await UserService.validatePassword(
    body.username as string,
    body.password as string,
  );
  if (user) {
    await setSignedCookie(c, "authenticated", user.user_id, "a8sdfas9fd9");
    return c.redirect("/");
  }
  return c.render(<SignIn error={"User account or password is incorrect."} />);
});

app.get("/", (c) => {
  const pathname = c.req.path;
  return c.render(
    <section className="mt-10 container mx-auto max-w-4xl">
      <SignIn />
    </section>,
  );
});

export default app;
