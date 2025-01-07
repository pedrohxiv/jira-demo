"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { createWorkspace } from "@/mutations/create-workspace";
import { createWorkspaceSchema } from "@/schemas/workspaces";

interface Props {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { mutate, isPending } = createWorkspace();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const handleFormSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    mutate(
      {
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

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new Workspace
        </CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
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
                        disabled={isPending}
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
                        <p className="text-sm font-medium">Workspace Icon</p>
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
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                disabled={isPending}
                size="lg"
                variant="secondary"
                onClick={onCancel}
                className={cn(!!!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} size="lg">
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
