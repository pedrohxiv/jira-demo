import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

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
