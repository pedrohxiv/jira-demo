import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";

import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/schemas/workspaces";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      let imageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString(
          "base64"
        )}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        { name, userId: user.$id, imageUrl }
      );

      return c.json({ data: workspace });
    }
  );

export default app;
