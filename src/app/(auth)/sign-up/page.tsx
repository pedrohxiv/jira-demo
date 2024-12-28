import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { SignUpForm } from "@/components/cards/sign-up-form";

const SignUpPage = async () => {
  const user = await auth();

  if (user) {
    return redirect("/");
  }

  return <SignUpForm />;
};

export default SignUpPage;
