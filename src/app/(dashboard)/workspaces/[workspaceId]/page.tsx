import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { Analytics } from "@/components/analytics";

import { MemberList } from "./_components/member-list";
import { ProjectList } from "./_components/project-list";
import { TaskList } from "./_components/task-list";

interface Props {
  params: { workspaceId: string };
}

const WorkspacePage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics workspaceId={params.workspaceId} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList workspaceId={params.workspaceId} />
        <ProjectList workspaceId={params.workspaceId} />
        <MemberList workspaceId={params.workspaceId} />
      </div>
    </div>
  );
};

export default WorkspacePage;
