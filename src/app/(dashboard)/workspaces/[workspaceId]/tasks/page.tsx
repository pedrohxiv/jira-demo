import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { TaskViewSwitcher } from "@/components/task-view-switcher";

interface Props {
  params: { workspaceId: string };
}

const TasksPage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <TaskViewSwitcher workspaceId={params.workspaceId} />;
};

export default TasksPage;
