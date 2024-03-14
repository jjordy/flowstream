import { createContext } from "hono/jsx";

const appContext = {
  pathname: "",
};

export const AppContext = createContext(appContext);
