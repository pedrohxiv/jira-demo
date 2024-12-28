import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getWorkspaceName } from "@/actions/workspaces";
import { JoinWorkspaceForm } from "@/components/cards/join-workspace-form";

interface Props {
  params: { workspaceId: string; inviteCode: string };
}

const JoinPage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkspaceName({
    workspaceId: params.workspaceId,
  });

  if (!workspace) {
    return redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        name={workspace.name}
        workspaceId={params.workspaceId}
        code={params.inviteCode}
      />
    </div>
  );
};

export default JoinPage;
