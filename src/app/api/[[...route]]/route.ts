import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "./auth";
import workspaces from "./workspaces";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
