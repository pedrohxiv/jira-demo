"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    name:
      type === "sign-in"
        ? z.undefined()
        : z.string().trim().min(1, "Name is required"),
    email: z.string().trim().min(1, "Email is required").email(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters"),
  });

interface Props {
  type: "sign-in" | "sign-up";
}

export const AuthCard = ({ type }: Props) => {
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(type)),
    defaultValues: {
      name: type === "sign-in" ? undefined : "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<ReturnType<typeof formSchema>>) => {
    console.log(values);
  };

  return (
    <Card className="size-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          {type === "sign-in" ? "Welcome Back!" : "Sign Up"}
        </CardTitle>
        {type === "sign-up" && (
          <CardDescription>
            By signing up, you agree to our{" "}
            <Link href="">
              <span className="text-blue-700">Privacy Policy</span>
            </Link>{" "}
            and{" "}
            <Link href="">
              <span className="text-blue-700">Terms of Service</span>
            </Link>
          </CardDescription>
        )}
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {type === "sign-up" && (
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={false} size="lg" className="w-full">
              {type === "sign-in" ? "Login" : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <Icons.google />
          Login with Google
        </Button>
      </CardContent>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
          <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"}>
            <span className="text-blue-700 ml-1">
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
