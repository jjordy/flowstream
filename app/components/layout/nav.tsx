import clsx from "clsx";
import { FC } from "hono/jsx";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { useIsAuthenticated } from "app/hooks/use-is-authenticated";

export const Nav: FC = async () => {
  const userId = await useIsAuthenticated();
  return (
    <nav className="flex items-center h-24 w-full shadow-xl">
      <ul className="flex items-center space-x-4 mx-24 w-full">
        <li className="mr-auto">
          <a href="/">
            <Logo>FlowStream</Logo>
          </a>
        </li>
        {userId && (
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
        )}
        {!userId && (
          <li>
            <NavLink href="/sign-in">Sign In</NavLink>
          </li>
        )}
        {userId && (
          <li>
            <NavLink href="/sign-out">Sign Out</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};
