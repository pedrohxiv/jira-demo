import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  PROJECTS_ID,
} from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Project } from "@/lib/types";
import {
  createProjectSchema,
  getProjectsSchema,
  updateProjectSchema,
} from "@/schemas/projects";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getProjectsSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = (
        await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({ data: projects });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = (
        await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        { name, imageUrl, workspaceId }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = (
        await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", existingProject.workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
      } else if (imageUrl === undefined) {
        imageUrl = "";
      } else {
        imageUrl = image;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        { name, imageUrl }
      );

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = (
      await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", existingProject.workspaceId),
        Query.equal("userId", user.$id),
      ])
    ).documents[0];

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: projectId } });
  });

export default app;
