"use client";

import { CreateProjectForm } from "@/components/cards/create-project-form";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { useCreateProject } from "@/hooks/use-create-project";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useCreateProject();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
