import { FC } from "hono/jsx";

export const FlowPageForm: FC<{ flow: any; pages: any }> = ({
  flow,
  pages,
}) => {
  return (
    <div className="bg-slate-100  rounded border-2 border-slate-300 p-8 my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-xl text-slate-600">Pages</div>
        <button
          className="button max-w-xs"
          hx-get={`/admin/flows/${flow.flow_id}/add-page`}
          hx-target="#modal"
        >
          add page
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      <form
        hx-post={`/admin/flows/${flow.flow_id}/page-order`}
        hx-trigger="end"
        hx-target="body"
        className="space-y-4 sortable"
      >
        <div className="htmx-indicator">updating...</div>
        {pages?.map((page: any, id: number) => (
          <div
            key={page.page_id}
            className=" bg-white rounded shadow-xl cursor-grab flex items-center h-16"
          >
            <div className="rounded-l bg-sky-400 text-white self-stretch w-12 flex items-center justify-center font-black text-3xl mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>

            <div>
              <a
                href={`/admin/pages/${page.page_id}`}
                className="underline text-indigo-600 font-semibold"
              >
                {page.title}
              </a>
              <input type="hidden" name={page.flow_page_id} value={id} />
              <p className="text-slate-600 font-bold">{page.description}</p>
            </div>
          </div>
        ))}
      </form>
      <div id="modal" />
    </div>
  );
};
