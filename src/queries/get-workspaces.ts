import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const getWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces["$get"]();

      if (!response.ok) {
        throw new Error();
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
