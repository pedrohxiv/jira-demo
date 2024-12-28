import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID, Query } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE, DATABASE_ID, MEMBERS_ID } from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  getCurrentUserSchema,
  signInSchema,
  signUpSchema,
} from "@/schemas/auth";

const app = new Hono()
  .get(
    "/current-user",
    sessionMiddleware,
    zValidator("query", getCurrentUserSchema),
    async (c) => {
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      let role: string | undefined;

      if (workspaceId) {
        const databases = c.get("databases");

        const member = (
          await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
            Query.equal("workspaceId", workspaceId),
            Query.equal("userId", user.$id),
          ])
        ).documents[0];

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        role = member.role;
      }

      return c.json({ data: { ...user, role } });
    }
  )
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

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
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

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
