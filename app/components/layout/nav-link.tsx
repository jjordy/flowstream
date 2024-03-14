import { AppContext } from "app/context";
import clsx from "clsx";
import { FC, useContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

export const NavLink: FC = ({ href, children }) => {
  const c = useRequestContext();
  return (
    <a
      href={href}
      className={clsx(
        "hover:font-bold text-slate-800",
        c.req.path === href && "font-semibold",
      )}
    >
      {children}
    </a>
  );
};
