import { useState } from "react";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { type ButtonProps } from "@/components/ui/button";

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);

    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);

    handleClose();
  };

  const Dialog = () => (
    <ConfirmationDialog
      open={promise !== null}
      onOpenChange={handleClose}
      title={title}
      message={message}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      variant={variant}
    />
  );

  return [Dialog, confirm];
};
