import { Folder, ListChecks, User } from "lucide-react";

import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { TaskStatus } from "@/lib/types";
import { getMembers } from "@/queries/get-members";
import { getProjects } from "@/queries/get-projects";

interface Props {
  workspaceId: string;
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ workspaceId, hideProjectFilter }: Props) => {
  const { projectId, assigneeId, status, dueDate, search, setFilters } =
    useTaskFilters();

  const { data: members } = getMembers({ workspaceId });
  const { data: projects } = getProjects({ workspaceId });

  const handleStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const handleAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const handleProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  const handleDateChange = (value: Date) => {
    setFilters({ dueDate: value ? value.toISOString() : null });
  };

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => handleStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecks className="size-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value="all">
            All Status
          </SelectItem>
          <SelectSeparator />
          <SelectItem className="cursor-pointer" value={TaskStatus.BACKLOG}>
            Backlog
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.TODO}>
            Todo
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.IN_PROGRESS}>
            In Progress
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.IN_REVIEW}>
            In Review
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.DONE}>
            Done
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => handleAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <User className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value="all">
            All Assignees
          </SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem
              key={member.value}
              value={member.value}
              className="cursor-pointer"
            >
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={(value) => handleProjectChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <Folder className="size-4 mr-2" />
            <SelectValue placeholder="All Projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value="all">
            All Projects
          </SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project) => (
            <SelectItem
              key={project.value}
              value={project.value}
              className="cursor-pointer"
            >
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto text-accent-foreground hover:bg-transparent"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(value) => handleDateChange(value)}
      />
    </div>
  );
};
