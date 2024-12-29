import { z } from "zod";

import { TaskStatus } from "@/lib/types";

export const getTasksSchema = z.object({
  workspaceId: z.string().min(1, "WorkspaceId is required"),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  dueDate: z.string().nullish(),
  search: z.string().nullish(),
});

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  status: z.nativeEnum(TaskStatus, {
    required_error: "Task status is required",
  }),
  workspaceId: z.string().min(1, "WorkspaceId is required"),
  projectId: z.string().min(1, "ProjectId is required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().min(1, "AssigneeId is required"),
});

export const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  status: z.nativeEnum(TaskStatus, {
    required_error: "Task status is required",
  }),
  projectId: z.string().min(1, "ProjectId is required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().min(1, "AssigneeId is required"),
  description: z.string().optional(),
});
