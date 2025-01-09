"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateTask } from "@/hooks/use-create-task";
import { getTasks } from "@/queries/get-tasks";

interface Props {
  workspaceId: string;
}

export const TaskList = ({ workspaceId }: Props) => {
  const { open: openCreateTask } = useCreateTask();

  const { data } = getTasks({ workspaceId });

  if (!data) {
    return (
      <div className="w-full h-[445px] rounded-md bg-muted animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({data.total})</p>
          <Button variant="muted" size="icon" onClick={openCreateTask}>
            <Plus className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.documents.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      {task.project && <p>{task.project.name}</p>}
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show all</Link>
        </Button>
      </div>
    </div>
  );
};
