"use client";

import { EditTaskForm } from "@/components/cards/edit-task-form";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { useEditTask } from "@/hooks/use-edit-task";

export const EditTaskModal = () => {
  const { taskId, close } = useEditTask();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskForm onCancel={close} taskId={taskId} />}
    </ResponsiveModal>
  );
};
