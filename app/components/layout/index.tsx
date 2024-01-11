import { PropsWithChildren } from "react";
import Navigation from "../navigation";
import { FlowSession } from "../../types/session";

export default function Layout({
  children,
  session,
}: PropsWithChildren & { session?: FlowSession }) {
  return (
    <>
      <Navigation session={session} />
      {children}
    </>
  );
}
