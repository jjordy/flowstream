import { Loader } from "app/components/loader";
import { FC } from "hono/jsx";
import { EntityQuery } from "../../queries/entity-search";
import { EntityResults } from "../../components/entity/entity-results";

export const AdminDashboard: FC<{ entities: EntityQuery }> = (
  { entities = [] } = { entities: [] },
) => {
  return (
    <div className="container mx-auto mt-10">
      <div className="flex items-center justify-around mb-4">
        <input
          name="entity_query"
          className="input max-w-[88%]"
          placeholder="Search for flows, pages, questions, rules"
          hx-trigger="input changed delay:500ms, entity_query"
          hx-post={`/admin/search`}
          hx-target="#search-results"
          hx-indicator=".htmx-indicator"
        />
        <div className="htmx-indicator -translate-x-8">
          <Loader />
        </div>
        <button
          hx-get="/admin/entity-modal"
          hx-target="#modal"
          className="px-4 py-3 bg-sky-400 hover:bg-sky-500 text-white font-bold rounded-lg flex items-center"
        >
          Create Entity
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 ml-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <div id="modal" />
      </div>
      <EntityResults entities={entities} />
    </div>
  );
};
