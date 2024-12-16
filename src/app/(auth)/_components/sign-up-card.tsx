"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signUp } from "@/actions/sign-up";
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
import { signUpSchema } from "@/schemas/auth";

export const SignUpCard = () => {
  const { mutate, isPending } = signUp();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    mutate(values);
  };

  return (
    <Card className="size-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our
          {isPending ? (
            <span className="text-neutral-300 mx-1">Privacy Policy</span>
          ) : (
            <Link href="">
              <span className="text-blue-700 mx-1">Privacy Policy</span>
            </Link>
          )}
          and
          {isPending ? (
            <span className="text-neutral-300 mx-1">Terms of Service</span>
          ) : (
            <Link href="">
              <span className="text-blue-700 mx-1">Terms of Service</span>
            </Link>
          )}
        </CardDescription>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="text"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
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
                      disabled={isPending}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size="lg" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={isPending}
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
        <p>Already have an account?</p>
        {isPending ? (
          <span className="text-neutral-300 ml-1">Sign In</span>
        ) : (
          <Link href="/sign-in">
            <span className="text-blue-700 ml-1">Sign In</span>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
