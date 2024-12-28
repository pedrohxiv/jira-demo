"use client";

import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { joinWorkspace } from "@/mutations/join-workspace";

interface Props {
  name: string;
  workspaceId: string;
  code: string;
}

export const JoinWorkspaceForm = ({ name, workspaceId, code }: Props) => {
  const router = useRouter();

  const { mutate, isPending } = joinWorkspace();

  const handleClick = () => {
    mutate(
      { param: { workspaceId }, json: { code } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{name}</strong>
        </CardDescription>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <Button
            className="w-full lg:w-fit"
            size="lg"
            variant="secondary"
            disabled={isPending}
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
          <Button
            className="w-full lg:w-fit"
            size="lg"
            disabled={isPending}
            onClick={handleClick}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
