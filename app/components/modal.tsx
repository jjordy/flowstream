import { Child, FC } from "hono/jsx";

export const Modal: FC<{ children: Child; title: string }> = ({
  title = "Create a new entity",
  children,
}) => {
  return (
    <dialog
      className="bg-slate-900/20 h-screen w-screen absolute inset-0 flex items-center justify-center"
      _="on closeModal remove me"
    >
      <div className="bg-white rounded-lg w-full max-w-4xl p-8">
        <div className="flex items-center justify-between">
          <h1 className="my-4 text-2xl font-semibold text-slate-700">
            {title}
          </h1>
          <button _="on click trigger closeModal">
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
};
