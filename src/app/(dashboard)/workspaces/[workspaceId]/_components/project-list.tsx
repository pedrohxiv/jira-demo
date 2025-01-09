"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProject } from "@/hooks/use-create-project";
import { getProjects } from "@/queries/get-projects";

interface Props {
  workspaceId: string;
}

export const ProjectList = ({ workspaceId }: Props) => {
  const { open: openCreateProject } = useCreateProject();

  const { data } = getProjects({ workspaceId });

  if (!data) {
    return (
      <div className="w-full h-[278px] rounded-md bg-muted animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({data.total})</p>
          <Button variant="secondary" size="icon" onClick={openCreateProject}>
            <Plus className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.documents.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
