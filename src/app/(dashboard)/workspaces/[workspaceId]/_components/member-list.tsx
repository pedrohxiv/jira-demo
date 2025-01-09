"use client";

import { Settings } from "lucide-react";
import Link from "next/link";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMembers } from "@/queries/get-members";

interface Props {
  workspaceId: string;
}

export const MemberList = ({ workspaceId }: Props) => {
  const { data } = getMembers({ workspaceId });

  if (!data) {
    return (
      <div className="w-full h-[201px] rounded-md bg-muted animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({data.total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.documents.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" />
                  <p className="text-lg font-medium line-clamp-1">
                    {member.name}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
