"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { WorkspaceAvatar } from "@/components/avatars/workspace-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProject } from "@/hooks/use-create-project";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getProjects } from "@/queries/get-projects";
import { getWorkspaces } from "@/queries/get-workspaces";

export const Sidebar = () => {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const { data: workspaces } = getWorkspaces();
  const { data: projects } = getProjects({ workspaceId: params.workspaceId });

  const { open: openCreateWorkspace } = useCreateWorkspace();
  const { open: openCreateProject } = useCreateProject();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image
          className="w-auto h-auto"
          src="/logo.svg"
          alt="logo"
          height={48}
          width={164}
          priority
        />
      </Link>
      <DottedSeparator className="my-4" />
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Workspaces</p>
          <RiAddCircleFill
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
            onClick={openCreateWorkspace}
          />
        </div>
        <Select value={params.workspaceId} onValueChange={onSelect}>
          <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.documents.map((workspace) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className="cursor-pointer"
              >
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DottedSeparator className="my-4" />
      <div className="flex flex-col">
        {routes.map((route) => {
          const href = `/workspaces/${params.workspaceId}${route.href}`;
          const Icon = pathname === href ? route.activeIcon : route.icon;

          return (
            <Link key={route.href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                  {
                    "bg-white shadow-sm hover:opacity-100 text-primary":
                      pathname === href,
                  }
                )}
              >
                <Icon className="size-5 text-neutral-500" />
                {route.label}
              </div>
            </Link>
          );
        })}
      </div>
      <DottedSeparator className="my-4" />
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Projects</p>
          <RiAddCircleFill
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
            onClick={openCreateProject}
          />
        </div>
        {projects?.documents.map((project) => {
          const href = `/workspaces/${params.workspaceId}/projects/${params.projectId}`;

          return (
            <Link href={href} key={project.$id}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                  {
                    "bg-white shadow-sm hover:opacity-100 text-primary":
                      pathname === href,
                  }
                )}
              >
                <ProjectAvatar name={project.name} image={project.imageUrl} />
                <span className="truncate">{project.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
