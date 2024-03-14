import { formatDistanceToNow } from "date-fns";
import { FC } from "hono/jsx";
import { EntityQuery } from "../queries/entity-search";

export const EntityResults: FC<{ entities: EntityQuery }> = ({
  entities = [],
}) => {
  return (
    <div id="search-results" className="space-y-4">
      {entities.map((entity) => {
        return (
          <div
            key={entity.entity_id}
            className="bg-white shadow-2xl rounded border border-slate-200 p-8"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold tracking-tight">
                <a href={`/admin/flows/${entity.entity_id}`}>{entity.title}</a>
              </div>
              <div>
                Updated{" "}
                {formatDistanceToNow(entity.updated_at, { addSuffix: true })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
