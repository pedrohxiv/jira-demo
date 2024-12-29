import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getProject } from "@/actions/projects";
import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { Button } from "@/components/ui/button";

import { TaskSwitcher } from "./task-switcher";

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
      <TaskSwitcher />
    </div>
  );
};

export default ProjectPage;
