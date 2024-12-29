import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getProject } from "@/actions/projects";
import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  params: { workspaceId: string; projectId: string };
}

const ProjectPage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const project = await getProject({ projectId: params.projectId });

  if (!project) {
    return redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <h2 className="text-lg font-semibold">{project.name}</h2>
        </div>
        <div className="">
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${params.workspaceId}/projects/${project.$id}/settings`}
            >
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <Tabs className="flex-1 w-full border rounded-lg">
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
            <Button size="sm" className="w-full lg:w-auto">
              <Plus className="size-4 mr-2" />
              New
            </Button>
          </div>
          <DottedSeparator className="my-4" />
          <DottedSeparator className="my-4" />
          <>
            <TabsContent value="table" className="mt-0"></TabsContent>
            <TabsContent value="kanban" className="mt-0"></TabsContent>
            <TabsContent value="calendar" className="mt-0"></TabsContent>
          </>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
