"use client";

import { ArrowLeft, Crown, MoreVertical, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { MemberRole } from "@/lib/types";
import { deleteMember } from "@/mutations/delete-member";
import { updateMember } from "@/mutations/update-member";
import { getCurrentUser } from "@/queries/get-current-user";
import { getMembers } from "@/queries/get-members";

interface Props {
  workspaceId: string;
  workspaceUserId: string;
}

export const MembersList = ({ workspaceId, workspaceUserId }: Props) => {
  const [DeleteMemberDialog, confirmDeleteMember] = useConfirm(
    "Remove Member",
    "This member will be removed from the workspace.",
    "destructive"
  );

  const router = useRouter();

  const { data: members } = getMembers({ workspaceId });
  const { data: currentUser } = getCurrentUser({ workspaceId });
  const { mutate: updateMemberMutate, isPending: updateMemberIsPending } =
    updateMember();
  const { mutate: deleteMemberMutate, isPending: deleteMemberIsPending } =
    deleteMember();

  const isPending = updateMemberIsPending || deleteMemberIsPending;

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMemberMutate(
      { param: { memberId }, json: { role } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const handleDeleteMember = async (memberId: string) => {
    const confirmed = await confirmDeleteMember();

    if (!confirmed) {
      return;
    }

    deleteMemberMutate(
      { param: { memberId } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  if (!members || !currentUser) {
    return null;
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteMemberDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        {members.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="flex flex-row items-center gap-2 text-sm font-medium">
                  {member.name}
                  {workspaceUserId === member.userId && (
                    <Crown className="size-4 text-amber-400" />
                  )}
                  {workspaceUserId !== member.userId &&
                    member.role === MemberRole.ADMIN && (
                      <ShieldCheck className="size-4 text-blue-700" />
                    )}
                </p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              {currentUser.$id !== member.userId &&
                workspaceUserId !== member.userId &&
                currentUser.role === MemberRole.ADMIN && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant="secondary"
                        size="icon"
                        disabled={isPending}
                      >
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="left"
                      align="center"
                      sideOffset={10}
                    >
                      {member.role === MemberRole.MEMBER && (
                        <DropdownMenuItem
                          className="font-medium cursor-pointer"
                          onClick={() =>
                            handleUpdateMember(member.$id, MemberRole.ADMIN)
                          }
                          disabled={isPending}
                        >
                          Set as Administrator
                        </DropdownMenuItem>
                      )}
                      {member.role === MemberRole.ADMIN && (
                        <DropdownMenuItem
                          className="font-medium cursor-pointer"
                          onClick={() =>
                            handleUpdateMember(member.$id, MemberRole.MEMBER)
                          }
                          disabled={isPending}
                        >
                          Set as Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="font-medium text-amber-700 cursor-pointer focus:text-amber-700"
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isPending}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
            {index < members.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
