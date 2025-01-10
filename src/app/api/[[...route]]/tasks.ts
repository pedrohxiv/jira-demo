import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";
import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
} from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Member, Project, Task } from "@/lib/types";
import {
  bulkUpdateTaskSchema,
  createTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from "@/schemas/tasks";
const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getTasksSchema),
    async (c) => {
      const { users } = await createAdminClient();

      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, projectId, assigneeId, status, dueDate, search } =
        c.req.valid("query");

      const member = (
        await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status) {
        query.push(Query.equal("status", status));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || user.email.split("@")[0],
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return { ...task, project, assignee };
      });

      return c.json({ data: { ...tasks, documents: populatedTasks } });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const { users } = await createAdminClient();

    const databases = c.get("databases");
    const currentUser = c.get("user");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const existingMember = (
      await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", task.workspaceId),
        Query.equal("userId", currentUser.$id),
      ])
    ).documents[0];

    if (!existingMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const member = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name || user.email.split("@")[0],
      email: user.email,
    };

    return c.json({ data: { ...task, project, assignee } });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { name, status, workspaceId, projectId, dueDate, assigneeId } =
        c.req.valid("json");

      const member = (
        await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/bulk-update",
    sessionMiddleware,
    zValidator("json", bulkUpdateTaskSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { tasks } = c.req.valid("json");

      const taskToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        taskToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to he same workspace" });
      }

      const workspaceId = workspaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const member = (
        await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;

          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", updateTaskSchema.partial()),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { taskId } = c.req.param();
      const { name, status, projectId, dueDate, assigneeId, description } =
        c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = (
        await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", existingTask.workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          dueDate,
          assigneeId,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { taskId } = c.req.param();

    const existingTask = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = (
      await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", existingTask.workspaceId),
        Query.equal("userId", user.$id),
      ])
    ).documents[0];

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: taskId } });
  });

export default app;
