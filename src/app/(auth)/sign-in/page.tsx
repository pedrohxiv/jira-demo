import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { SignInForm } from "@/components/cards/sign-in-form";

const SignInPage = async () => {
  const user = await auth();

  if (user) {
    return redirect("/");
  }

  return <SignInForm />;
};

export default SignInPage;
