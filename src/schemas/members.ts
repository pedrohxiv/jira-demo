import { z } from "zod";

import { MemberRole } from "@/lib/types";

export const getMembersSchema = z.object({
  workspaceId: z.string().min(1, "WorkspaceId is required"),
});

export const updateMemberSchema = z.object({
  role: z.nativeEnum(MemberRole),
});
