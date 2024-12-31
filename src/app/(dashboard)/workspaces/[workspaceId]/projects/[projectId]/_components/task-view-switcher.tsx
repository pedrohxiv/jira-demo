"use client";

import { Plus } from "lucide-react";
import { useCallback } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTask } from "@/hooks/use-create-task";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useTaskView } from "@/hooks/use-task-view";
import { TaskStatus } from "@/lib/types";
import { bulkUpdateTasks } from "@/mutations/bulk-update-tasks";
import { getTasks } from "@/queries/get-tasks";

import { columns } from "./columns";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

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
  const { mutate, isPending } = bulkUpdateTasks();

  const handleKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      mutate({ json: { tasks } });
    },
    [mutate]
  );

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
        {!data ? (
          <></>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={data.documents} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={data.documents} onChange={handleKanbanChange} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0"></TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
