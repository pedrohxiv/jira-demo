import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"],
  200
>;

export const signOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      queryClient.invalidateQueries();

      router.refresh();
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
