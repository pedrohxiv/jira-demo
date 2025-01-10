import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Member, MemberRole } from "@/lib/types";
import { getMembersSchema, updateMemberSchema } from "@/schemas/members";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getMembersSchema),
    async (c) => {
      const { users } = await createAdminClient();

      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = (
        await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || user.email.split("@")[0],
            email: user.email,
            userId: user.$id,
            role: member.role,
          };
        })
      );

      return c.json({ data: { ...members, documents: populatedMembers } });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { memberId } = c.req.param();

    const memberToDelete = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = (
      await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", memberToDelete.workspaceId),
        Query.equal("userId", user.$id),
      ])
    ).documents[0];

    if (
      !member ||
      (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN)
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot delete the only member" }, 400);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", updateMemberSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const memberToUpdate = await databases.getDocument<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = (
        await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", memberToUpdate.workspaceId),
          Query.equal("userId", user.$id),
        ])
      ).documents[0];

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "Cannot downgrade the only member" }, 400);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
