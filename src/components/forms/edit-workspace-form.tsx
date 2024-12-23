"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { Workspace } from "@/lib/types";
import { deleteWorkspace } from "@/mutations/delete-workspace";
import { updateWorkspace } from "@/mutations/update-workspace";
import { updateWorkspaceSchema } from "@/schemas/workspaces";

interface Props {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: Props) => {
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );

  const { mutate: updateMutate, isPending: updateIsPending } =
    updateWorkspace();
  const { mutate: deleteMutate, isPending: deleteIsPending } =
    deleteWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { ...initialValues, image: initialValues.imageUrl ?? "" },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    updateMutate(
      {
        param: {
          workspaceId: initialValues.$id,
        },
        form: {
          ...values,
          image: values.image instanceof File ? values.image : "",
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();

          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirmDelete();

    if (!confirmed) {
      return;
    }

    deleteMutate(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            disabled={updateIsPending || deleteIsPending}
            onClick={!!onCancel ? onCancel : () => router.back()}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <DottedSeparator className="px-7" />
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={updateIsPending || deleteIsPending}
                          type="text"
                          placeholder="Enter workspace name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden group">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="logo"
                              fill
                              className="object-cover"
                            />
                            {!(updateIsPending || deleteIsPending) && (
                              <div className="absolute top-0 right-0 m-0.5">
                                <X
                                  className="size-5 cursor-pointer opacity-0 transition-opacity duration-100 group-hover:opacity-100 bg-muted rounded-md"
                                  onClick={() => {
                                    field.onChange(null);

                                    if (inputRef.current) {
                                      inputRef.current.value = "";
                                    }

                                    form.setValue("image", "");
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1 MB
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            ref={inputRef}
                            disabled={updateIsPending || deleteIsPending}
                            onChange={handleImageChange}
                            accept=".jpg, .png, .svg, .jpeg"
                          />
                          <Button
                            type="button"
                            disabled={updateIsPending || deleteIsPending}
                            variant="teritary"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={updateIsPending || deleteIsPending}
                  size="lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size="lg"
              variant="destructive"
              type="button"
              disabled={updateIsPending || deleteIsPending}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
