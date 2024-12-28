import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Props {
  workspaceId?: string;
}

export const getCurrentUser = ({ workspaceId }: Props = {}) => {
  const query = useQuery({
    queryKey: ["current-user", workspaceId],
    queryFn: async () => {
      const response = await client.api.auth["current-user"]["$get"]({
        query: { workspaceId },
      });

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
