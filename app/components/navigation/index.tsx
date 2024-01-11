import { FlowSession } from "../../types/session";
import { ModeToggle } from "./mode-toggle";
import { SettingsToggle } from "./settings-toggle";
export default function Navigation({ session }: { session?: FlowSession }) {
  return (
    <nav className="h-16 dark:bg-slate-900/60 flex items-center px-16 bg-slate-200 dark:text-white text-slate-700">
      <ul className="flex items-center w-full">
        <li className="mr-auto font-semibold tracking-widest">
          {"<"}FlowStream{">"}
        </li>
        {session && (
          <li>
            <SettingsToggle />
          </li>
        )}
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
}
