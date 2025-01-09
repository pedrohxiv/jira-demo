import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Props {
  workspaceId: string;
}

export const getWorkspaceAnalytics = ({ workspaceId }: Props) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["analytics"][
        "$get"
      ]({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error();
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
