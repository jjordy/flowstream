import { Hono } from "hono";
import { FlowPage } from "./index";
import { UserService } from "services/user";
import { isAuthenticated } from "app/middlewares/isAuthenticated";
const app = new Hono();

app.get("/:flowId/:pageId?", isAuthenticated, async (c) => {
  const flowId = c.req.param("flowId");
  const pageId = c.req.param("pageId");

  if (!flowId) {
    return c.redirect("/");
  }

  const page = await UserService.getPage(c.var.user, flowId, pageId);

  if (page && !pageId) {
    return c.redirect(`/flows/${flowId}/${page.page_id}`);
  }

  if (!page) {
    return c.redirect("/");
  }

  return c.render(<FlowPage flowId={flowId} page={page} />);
});

app.post("/:flowId/start", isAuthenticated, async (c) => {
  const flowId = c.req.param("flowId");
  const pageId = await UserService.startFlow(c.var.user, flowId);
  return c.redirect(`/flows/${flowId}/${pageId}`);
});

app.post("/:flowId/:pageId", isAuthenticated, async (c) => {
  const flowId = c.req.param("flowId");
  const pageId = c.req.param("pageId");
  const submission = await c.req.parseBody();
  // TODO: Add submission parser and validator
  const nextPageId = await UserService.savePage(
    // provided by isAuthenticated
    c.var.user,
    flowId,
    pageId,
    submission,
  );

  if (!nextPageId) {
    return c.redirect("/");
  }
  return c.redirect(`/flows/${flowId}/${nextPageId}`);
});

export default app;
