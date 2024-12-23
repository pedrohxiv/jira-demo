import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { signInSchema, signUpSchema } from "@/schemas/auth";

const app = new Hono()
  .get("/current-user", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/sign-in", zValidator("form", signInSchema), async (c) => {
    const { email, password } = c.req.valid("form");

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/sign-up", zValidator("form", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("form");

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/sign-out", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);

    await account.deleteSession("current");

    return c.json({ success: true });
  });

export default app;
