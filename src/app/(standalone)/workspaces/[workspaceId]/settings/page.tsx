import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getWorkspace } from "@/actions/workspaces";
import { EditWorkspaceForm } from "@/components/cards/edit-workspace-form";

interface Props {
  params: { workspaceId: string };
}

const SettingPage = async ({ params }: Props) => {
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
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default SettingPage;