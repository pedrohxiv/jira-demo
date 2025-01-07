import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getProject } from "@/actions/projects";
import { EditProjectForm } from "@/components/cards/edit-project-form";

interface Props {
  params: { workspaceId: string; projectId: string };
}

const ProjectSettingPage = async ({ params }: Props) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const project = await getProject({ projectId: params.projectId });

  if (!project) {
    return redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm project={project} />
    </div>
  );
};

export default ProjectSettingPage;
