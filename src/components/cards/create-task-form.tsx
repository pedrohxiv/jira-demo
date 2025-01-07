"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { DatePicker } from "@/components/date-picker";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createTask } from "@/mutations/create-task";
import { getMembers } from "@/queries/get-members";
import { getProjects } from "@/queries/get-projects";
import { createTaskSchema } from "@/schemas/tasks";

interface Props {
  onCancel?: () => void;
}

export const CreateTaskForm = ({ onCancel }: Props) => {
  const params = useParams<{ workspaceId: string }>();

  const { data: projects } = getProjects({ workspaceId: params.workspaceId });
  const { data: members } = getMembers({ workspaceId: params.workspaceId });
  const { mutate, isPending } = createTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      dueDate: undefined,
      status: undefined,
      assigneeId: undefined,
      projectId: undefined,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId: params.workspaceId } },
      {
        onSuccess: () => {
          form.reset();

          onCancel?.();
        },
      }
    );
  };

  if (!projects || !members) {
    return <Card className="w-full h-[714px] border-none shadow-none" />;
  }

  const projectOptions = projects.documents.map((project) => ({
    $id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members.documents.map((member) => ({
    $id: member.$id,
    name: member.name,
  }));

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new Task</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="text"
                        placeholder="Enter task name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dueDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "transition-colors disabled:bg-transparent disabled:text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            { "text-muted-foreground": !field.value }
                          )}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem
                          value={TaskStatus.BACKLOG}
                          className="cursor-pointer"
                        >
                          Backlog
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.TODO}
                          className="cursor-pointer"
                        >
                          Todo
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.IN_PROGRESS}
                          className="cursor-pointer"
                        >
                          In Progress
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.IN_REVIEW}
                          className="cursor-pointer"
                        >
                          In Review
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.DONE}
                          className="cursor-pointer"
                        >
                          Done
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="assigneeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "transition-colors disabled:bg-transparent disabled:text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            { "text-muted-foreground": !field.value }
                          )}
                        >
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem
                            key={member.$id}
                            value={member.$id}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                name={member.name}
                                className="size-6"
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="projectId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "transition-colors disabled:bg-transparent disabled:text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            { "text-muted-foreground": !field.value }
                          )}
                        >
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem
                            key={project.$id}
                            value={project.$id}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                name={project.name}
                                image={project.imageUrl}
                                className="size-6"
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                disabled={isPending}
                size="lg"
                variant="secondary"
                onClick={onCancel}
                className={cn(!!!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} size="lg">
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
