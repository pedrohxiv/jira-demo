import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
};

export type Workspace = Models.Document & {
  name: string;
  userId: string;
  imageUrl: string;
  inviteCode: string;
};

export type Project = Models.Document & {
  name: string;
  workspaceId: string;
  imageUrl: string;
};

export type Task = Models.Document & {
  workspaceId: string;
  name: string;
  projectId: string;
  assigneeId: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  position: number;
};
