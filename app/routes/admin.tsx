import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Layout from "../components/layout";
import { requireAdminUserSession } from "../sessions.server";
import { FlowSession } from "app/types/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await requireAdminUserSession(request);
  return json({ session, value: "test" });
}

export default function AdminRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Layout session={data.session as FlowSession}>
        <Outlet />
      </Layout>
    </>
  );
}
