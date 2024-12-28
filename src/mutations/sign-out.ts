import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"]
>;

export const signOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth["sign-out"]["$post"]();

      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();

      queryClient.invalidateQueries({ queryKey: ["current-user"] });
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
