"use client";

import { Plus } from "lucide-react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTask } from "@/hooks/use-create-task";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useTaskView } from "@/hooks/use-task-view";
import { getTasks } from "@/queries/get-tasks";

import { DataFilters } from "./data-filters";

interface Props {
  workspaceId: string;
}

export const TaskViewSwitcher = ({ workspaceId }: Props) => {
  const { open } = useCreateTask();
  const { view, setView } = useTaskView();
  const { projectId, assigneeId, status, dueDate, search } = useTaskFilters();

  const { data } = getTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
    search,
  });

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <Plus className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters workspaceId={workspaceId} />
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0"></TabsContent>
          <TabsContent value="kanban" className="mt-0"></TabsContent>
          <TabsContent value="calendar" className="mt-0"></TabsContent>
        </>
      </div>
    </Tabs>
  );
};
