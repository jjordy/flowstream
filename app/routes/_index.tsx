import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import Layout from "../components/layout";
import { userHasSession } from "../sessions.server";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "../components/ui/button";
import { FlowSession } from "app/types/session";

export const meta: MetaFunction = () => {
  return [
    { title: "FlowStream | Home" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await userHasSession(request);
  return json({ session });
}

export default function Index() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <Layout session={session as FlowSession}>
      <main>
        <div className="w-full bg-gradient-to-tr dark:from-slate-900/40 dark:to-zinc-600/10 from-blue-500/40 to-sky-900/60  md:p-64">
          <div className="container mx-auto relative">
            <div className="flex items-center justify-between w-full relative">
              <div className="space-y-4">
                <h1
                  className="text-7xl font-black tracking-wide max-w-sm"
                  style={{ textShadow: "1px 1px 1px #222" }}
                >
                  Gather targeted, fact based data
                </h1>
                <Button asChild size="lg">
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </div>
              <div>
                <img src="/branch_web.png" alt="" className="w-full h-full" />
              </div>
            </div>
            <div className="space-y-4"></div>
          </div>
        </div>
        <div className="md:p-64 bg-white w-full text-black">
          <div className="container mx-auto">
            <h2>Act on data driven events and focus on your business </h2>
            <h3>
              <span className="text-3xl font-black uppercase tracking-widest my-4 mr-2">
                not
              </span>
              data collection.
            </h3>
          </div>
        </div>
        <div className="md:p-64 bg-slate-300 w-full text-black">
          <div className="container mx-auto">
            <h2>Act on data driven events and focus on your business </h2>
            <h3>
              <span className="text-3xl font-black uppercase tracking-widest my-4 mr-2">
                not
              </span>
              data collection.
            </h3>
          </div>
        </div>
      </main>
    </Layout>
  );
}
