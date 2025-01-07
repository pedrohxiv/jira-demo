"use client";

import { ChevronRight, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Project, Task } from "@/lib/types";
import { deleteTask } from "@/mutations/delete-task";

interface Props {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: Props) => {
  const [DeleteTaskDialog, confirmDeleteTask] = useConfirm(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { mutate, isPending } = deleteTask();

  const handleDeleteTask = async () => {
    const confirmed = await confirmDeleteTask();

    if (!confirmed) {
      return;
    }

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${params.workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <DeleteTaskDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${params.workspaceId}/projects/${project.$id}`}>
        <h1 className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </h1>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <h1 className="text-sm lg:text-lg font-semibold">{task.name}</h1>
      <Button
        className="ml-auto"
        variant="destructive"
        size="sm"
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <Trash className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
