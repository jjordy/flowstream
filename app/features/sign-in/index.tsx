import { FC } from "hono/jsx";

export const SignIn: FC = ({ error = null }) => {
  return (
    <form method="POST" action="/sign-in">
      <fieldset className="mb-4">
        <legend className="font-semibold text-xl my-4">Sign In</legend>
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
          <label for="id_username">Username</label>
          <input
            type="text"
            name="username"
            id="id_username"
            required
            className="input"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label for="id_password">Password</label>
          <input
            type="password"
            name="password"
            id="id_password"
            required
            className="input"
          />
        </div>
      </fieldset>
      <button type="submit" className="button">
        Sign In
      </button>
    </form>
  );
};
