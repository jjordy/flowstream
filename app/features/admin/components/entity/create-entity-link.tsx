import { Child, FC } from "hono/jsx";

export const CreateEntityLink: FC<{ href: string; children: Child }> = ({
  href,
  children,
}) => {
  return (
    <a
      href={href}
      className="flex items-center justify-center p-8 border-2 bg-sky-100/30 border-sky-400 text-slate-600 hover:border-sky-500 hover:text-sky-600 rounded-lg text-2xl font-semibold"
    >
      {children}
    </a>
  );
};
