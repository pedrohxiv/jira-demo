import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Props {
  taskId: string;
}

export const getTask = ({ taskId }: Props) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
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
