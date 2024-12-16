import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";

import { SignInCard } from "../_components/sign-in-card";

const SignInPage = async () => {
  const user = await auth();

  if (user) {
    return redirect("/");
  }

  return <SignInCard />;
};

export default SignInPage;
