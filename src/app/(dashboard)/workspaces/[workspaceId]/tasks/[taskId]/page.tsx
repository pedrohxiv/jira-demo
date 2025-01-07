import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getTask } from "@/actions/tasks";
import { DottedSeparator } from "@/components/dotted-separator";

import { TaskBreadcrumbs } from "./_components/task-breadcrumbs";
import { TaskDescription } from "./_components/task-description";
import { TaskOverview } from "./_components/task-overview";

interface Props {
  params: { workspaceId: string; taskId: string };
}

const TaskPage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const task = await getTask({ taskId: params.taskId });

  if (!task) {
    return redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
};

export default TaskPage;
