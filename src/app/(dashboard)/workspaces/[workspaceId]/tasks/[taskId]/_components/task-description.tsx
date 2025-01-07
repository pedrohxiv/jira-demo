"use client";

import { Pencil, X } from "lucide-react";
import { useState } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Member, Task } from "@/lib/types";
import { updateTask } from "@/mutations/update-task";

interface Props {
  task: Task & { assignee: Member & { name: string; email: string } };
}

export const TaskDescription = ({ task }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(task.description);

  const { mutate, isPending } = updateTask();

  const handleSave = () => {
    mutate(
      { param: { taskId: task.$id }, json: { description: value } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing((prev) => !prev)}
          disabled={isPending}
        >
          {isEditing ? (
            <X className="size-4 mr-2" />
          ) : (
            <Pencil className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            size="sm"
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            Save Changes
          </Button>
        </div>
      ) : (
        task.description || (
          <span className="text-muted-foreground">No description set.</span>
        )
      )}
    </div>
  );
};
