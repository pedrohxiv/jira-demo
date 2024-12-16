import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { UserButton } from "@/components/user-button";

const RootPage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <UserButton />;
};

export default RootPage;
