"use client";

import { Pencil } from "lucide-react";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskDate } from "@/components/task-date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEditTask } from "@/hooks/use-edit-task";
import { Member, Task } from "@/lib/types";
import { snakeCaseToTitleCase } from "@/lib/utils";

import { OverviewProperty } from "./overview-property";

interface Props {
  task: Task & { assignee: Member & { name: string; email: string } };
}

export const TaskOverview = ({ task }: Props) => {
  const { open } = useEditTask();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overview</h2>
          <Button size="sm" variant="secondary" onClick={() => open(task.$id)}>
            <Pencil className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
