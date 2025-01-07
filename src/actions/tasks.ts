import { Query } from "node-appwrite";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
} from "@/lib/constants";
import { Member, Project, Task } from "@/lib/types";

interface GetTaskProps {
  taskId: string;
}

export const getTask = async ({ taskId }: GetTaskProps) => {
  try {
    const { users } = await createAdminClient();
    const { account, databases } = await createSessionClient();

    const currentUser = await account.get();

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
      return null;
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
      name: user.name,
      email: user.email,
    };

    return { ...task, project, assignee };
  } catch {
    return null;
  }
};
