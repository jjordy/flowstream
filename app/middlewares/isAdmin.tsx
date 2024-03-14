import { db } from "db";
import { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";

export const isAdmin: MiddlewareHandler<{
  Variables: {
    team: any;
  };
}> = async (c, next) => {
  const cookie = await getSignedCookie(c, "a8sdfas9fd9");
  if (cookie?.authenticated) {
    const u = await db
      .selectFrom("user")
      .innerJoin("team_user", "user.id", "team_user.user_id")
      .innerJoin("team", "team_user.team_id", "team.id")
      .select([
        "team_user.role",
        "team.id as __internal_team_id",
        "team.name",
        "team.team_id",
      ])
      .where("user.user_id", "=", cookie.authenticated)
      .executeTakeFirst();
    if (u?.role) {
      c.set("team", u);
      return await next();
    }
  }
  return c.redirect("/");
};
