import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";

import { SignUpCard } from "../_components/sign-up-card";

const SignUpPage = async () => {
  const user = await auth();

  if (user) {
    return redirect("/");
  }

  return <SignUpCard />;
};

export default SignUpPage;
