import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getMembers } from "@/queries/get-members";
import { getProjects } from "@/queries/get-projects";

interface Props {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({ onCancel }: Props) => {
  const params = useParams<{ workspaceId: string }>();

  const { data: projects } = getProjects({ workspaceId: params.workspaceId });
  const { data: members } = getMembers({ workspaceId: params.workspaceId });

  if (!projects || !members) {
    return <Card className="w-full h-[714px] border-none shadow-none" />;
  }

  

  return null;
};
