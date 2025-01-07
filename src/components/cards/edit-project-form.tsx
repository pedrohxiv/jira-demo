"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
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
import { Project } from "@/lib/types";
import { deleteProject } from "@/mutations/delete-project";
import { updateProject } from "@/mutations/update-project";
import { updateProjectSchema } from "@/schemas/projects";

interface Props {
  onCancel?: () => void;
  project: Project;
}

export const EditProjectForm = ({ onCancel, project }: Props) => {
  const [DeleteProjectDialog, confirmDeleteProject] = useConfirm(
    "Delete Project",
    "This action cannot be undone.",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { mutate: updateProjectMutate, isPending: updateProjectIsPending } =
    updateProject();
  const { mutate: deleteProjectMutate, isPending: deleteProjectIsPending } =
    deleteProject();

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      image: project.imageUrl,
    },
  });

  const isPending = updateProjectIsPending || deleteProjectIsPending;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const handleFormSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    updateProjectMutate({
      param: { projectId: project.$id },
      form: {
        ...values,
        image: values.image instanceof File ? values.image : "",
      },
    });
  };

  const handleDeleteProject = async () => {
    const confirmed = await confirmDeleteProject();

    if (!confirmed) {
      return;
    }

    deleteProjectMutate(
      { param: { projectId: project.$id } },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${project.workspaceId}`;
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteProjectDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            disabled={isPending}
            onClick={!!onCancel ? onCancel : () => router.back()}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
        </CardHeader>
        <DottedSeparator className="px-7" />
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <div className="flex flex-col">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="text"
                          placeholder="Enter project name"
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
                    <div className="flex flex-col mt-5">
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
                            {!isPending && (
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
                          <p className="text-sm font-medium">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1 MB
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                            accept=".jpg, .png, .svg, .jpeg"
                          />
                          <Button
                            type="button"
                            disabled={isPending}
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
                <DottedSeparator className="py-7" />
                <Button
                  className="w-fit ml-auto"
                  type="submit"
                  disabled={isPending}
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
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="w-fit ml-auto"
              size="lg"
              variant="destructive"
              type="button"
              disabled={isPending}
              onClick={handleDeleteProject}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
