import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Props {
  workspaceId: string;
}

export const getTasks = ({ workspaceId }: Props) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks["$get"]({
        query: { workspaceId },
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
