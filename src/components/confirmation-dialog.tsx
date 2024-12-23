import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  message: string;
  handleCancel: () => void;
  handleConfirm: () => void;
  variant: ButtonProps["variant"];
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  message,
  handleCancel,
  handleConfirm,
  variant = "primary",
}: Props) => {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
