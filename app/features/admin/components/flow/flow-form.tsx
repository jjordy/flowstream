import { FC } from "hono/jsx";

export const FlowForm: FC = ({ error, flow, pages }) => {
  return (
    <>
      <form
        method="POST"
        action={flow ? `/admin/flows/${flow.flow_id}` : "/admin/flows/create"}
      >
        <fieldset className="border-2 border-slate-300 bg-slate-100 p-8 rounded mb-4">
          <legend className="font-semibold text-xl my-4">
            Enter flow details
          </legend>
          {error && (
            <div className="p-4 bg-red-300 text-red-900 my-4 flex items-center font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>

              {error}
            </div>
          )}
          <div className="flex flex-col space-y-2 mb-2">
            <label for="id_title">Title</label>
            <input
              type="text"
              name="title"
              id="id_title"
              value={flow?.title}
              required
              className="input"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label for="id_slug">Slug</label>
            <input
              type="text"
              name="slug"
              value={flow?.slug}
              id="id_slug"
              required
              className="input"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label for="id_password">Description</label>
            <textarea
              type="text"
              name="description"
              id="id_description"
              required
              className="input"
            >
              {flow?.description}
            </textarea>
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            {flow && (
              <a href={`/admin/flows/${flow?.flow_id}/pages`} className="link">
                Edit Pages ({pages?.total_pages})
              </a>
            )}
          </div>
        </fieldset>

        <button type="submit" className="button">
          Save Flow
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 ml-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </button>
      </form>
      <div></div>
    </>
  );
};
