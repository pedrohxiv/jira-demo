"use client";

import { ColumnDef } from "@tanstack/react-table";
import { differenceInDays, format } from "date-fns";
import {
  ArrowUpDown,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/lib/types";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center justify-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-6"
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      return (
        <div className="flex items-center justify-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            name={assignee.name}
            className="size-6"
            fallbackClassName="text-xs"
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      const diffInDays = differenceInDays(new Date(dueDate), new Date());

      let textColor = "text-muted-foreground";

      if (diffInDays <= 3) {
        textColor = "text-red-500";
      } else if (diffInDays <= 7) {
        textColor = "text-orange-500";
      } else if (diffInDays <= 14) {
        textColor = "text-yellow-500";
      }

      return (
        <p className={cn("truncate", textColor)}>{format(dueDate, "PPP")}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <div className="flex items-center justify-center">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {}}
                disabled={false}
                className="cursor-pointer font-medium p-[10px]"
              >
                <ExternalLink className="size-4 mr-2 stroke-2" />
                Task Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                disabled={false}
                className="cursor-pointer font-medium p-[10px]"
              >
                <ExternalLink className="size-4 mr-2 stroke-2" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                disabled={false}
                className="cursor-pointer font-medium p-[10px]"
              >
                <Pencil className="size-4 mr-2 stroke-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}}
                disabled={false}
                className="cursor-pointer text-amber-700 focus:text-amber-700 font-medium p-[10px]"
              >
                <Trash className="size-4 mr-2 stroke-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
