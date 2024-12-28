import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "./auth";
import members from "./members";
import workspaces from "./workspaces";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/members", members)
  .route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
