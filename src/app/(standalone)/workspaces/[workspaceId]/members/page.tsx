import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getWorkspace } from "@/actions/workspaces";
import { MembersList } from "@/components/cards/members-list";

interface Props {
  params: { workspaceId: string };
}

const MembersPage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkspace({ workspaceId: params.workspaceId });

  if (!workspace) {
    return redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList
        workspaceId={params.workspaceId}
        workspaceUserId={workspace.userId}
      />
    </div>
  );
};

export default MembersPage;
