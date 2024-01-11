import { Session } from "@remix-run/node";

export type SessionData = { userId: string; theme: "dark" | "light" };

export type SessionFlashData = { error: string };

export type FlowSession = Session<SessionData, SessionFlashData>;

export {};
