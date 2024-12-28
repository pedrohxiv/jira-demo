"use client";

import { CreateWorkspaceForm } from "@/components/cards/create-workspace-form";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useCreateWorkspace();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
