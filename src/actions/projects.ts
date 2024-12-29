import { Query } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID } from "@/lib/constants";
import { Project } from "@/lib/types";

interface GetProjectProps {
  projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = (
      await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", project.workspaceId),
        Query.equal("userId", user.$id),
      ])
    ).documents[0];

    if (!member) {
      return null;
    }

    return project;
  } catch {
    return null;
  }
};
