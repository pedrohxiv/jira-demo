import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Props {
  projectId: string;
}

export const getProjectAnalytics = ({ projectId }: Props) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"]["analytics"][
        "$get"
      ]({
        param: { projectId },
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
