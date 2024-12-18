import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)["$post"]
>["json"];

export const createWorkspace = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.workspaces["$post"]({ json });

      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  return mutation;
};
