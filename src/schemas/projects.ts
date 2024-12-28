import { z } from "zod";

export const getProjectsSchema = z.object({
  workspaceId: z.string().min(1, "WorkspaceId is required"),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Workspace name is required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string().min(1, "WorkspaceId is required"),
});
