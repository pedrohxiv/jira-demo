import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";

const WorkspacePage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return null;
};

export default WorkspacePage;
