import { db } from "db";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

export const FlowPageCount: FC<{ flowId: string; userId: string }> = async ({
  flowId,
  userId,
}) => {
  const query = await db
    .selectFrom("user")
    .innerJoin("user_flow_progress", "user_flow_progress.user_id", "user.id")
    .innerJoin("flow", "flow.id", "user_flow_progress.flow_id")
    .select(["progress"])
    .where("user.user_id", "=", userId)
    .where("flow.flow_id", "=", flowId)
    .executeTakeFirst();
  return (
    <div className="flex flex-no-wrap h-2 w-full">
      <progress
        className="w-full m-0 p-0 [&::-moz-progress-bar]:bg-teal-400"
        value={query?.progress || 0}
        max={100}
        min={0}
        id="flow-progress"
      >
        {query?.progress}% Completed
      </progress>
    </div>
  );
};
