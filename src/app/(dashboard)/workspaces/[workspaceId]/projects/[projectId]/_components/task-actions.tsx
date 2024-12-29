import { ExternalLink, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useEditTask } from "@/hooks/use-edit-task";
import { Task } from "@/lib/types";
import { deleteTask } from "@/mutations/delete-task";

interface Props {
  task: Task;
  children: React.ReactNode;
}

export const TaskActions = ({ task, children }: Props) => {
  const [DeleteTaskDialog, confirmDeleteTask] = useConfirm(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );

  const router = useRouter();

  const { mutate, isPending } = deleteTask();

  const { open } = useEditTask();

  const handleOpenTask = () => {
    router.push(`/workspaces/${task.workspaceId}/tasks/${task.$id}`);
  };

  const handleOpenProject = () => {
    router.push(`/workspaces/${task.workspaceId}/projects/${task.projectId}`);
  };

  const handleEditTask = () => {
    open(task.$id);
  };

  const handleDeleteTask = async () => {
    const confirmed = await confirmDeleteTask();

    if (!confirmed) {
      return;
    }

    mutate({ param: { taskId: task.$id } });
  };

  return (
    <div className="flex items-center justify-center">
      <DeleteTaskDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleOpenTask}
            disabled={isPending}
            className="cursor-pointer font-medium p-[10px]"
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenProject}
            disabled={isPending}
            className="cursor-pointer font-medium p-[10px]"
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleEditTask}
            disabled={isPending}
            className="cursor-pointer font-medium p-[10px]"
          >
            <Pencil className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            disabled={isPending}
            className="cursor-pointer text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
