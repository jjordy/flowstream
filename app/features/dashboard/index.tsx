import { useIsAuthenticated } from "app/hooks/use-is-authenticated";
import { FC } from "hono/jsx";
import { UserService } from "services/user";
import { FlowPageCount } from "./components/flow-page-count";
import { user } from "db/data-repositories/user";

export const Dashboard: FC = async () => {
  const userId = await useIsAuthenticated({ redirect: true });
  const u = await user.findById(userId!);
  const flows = await UserService.getFlows(userId!);
  return (
    <section className="mt-10 container mx-auto">
      <h1 className="text-center text-5xl tracking-tight leading-none my-4">
        Welcome {u!.email}
      </h1>
      <h2 className="text-center text-slate-600 text-xl font-semibold tracking-wide leading-none mb-8">
        You have {flows.length} active offers
      </h2>
      <div className="grid grid-cols-3 gap-16">
        {flows.map((flow) => (
          <div
            key={flow.flow_id}
            className=" shadow-2xl flex flex-col justify-start"
          >
            <FlowPageCount flowId={flow.flow_id} userId={userId!} />
            <div className="text-3xl my-4 px-8">{flow.title}</div>
            <div className="pb-8 text-justify px-8 mb-auto">
              <p>{flow.description}</p>
            </div>
            <form method="POST" action={`/flows/${flow.flow_id}/start`}>
              <button
                type="submit"
                className="px-4 py-3 bg-sky-400 text-white  hover:bg-sky-500 rounded-b w-full text-center font-bold"
              >
                Get Started
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
};
