"use client";

import { CreateTaskForm } from "@/components/cards/create-task-form";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { useCreateTask } from "@/hooks/use-create-task";

export const CreateTaskModal = () => {
  const { isOpen, close, setIsOpen } = useCreateTask();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskForm onCancel={close} />
    </ResponsiveModal>
  );
};
