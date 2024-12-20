import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { getWorkspaces } from "@/actions/workspaces";

const DashboardPage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    return redirect("/workspaces/create");
  }

  return redirect(`/workspaces/${workspaces.documents[0].$id}`);
};

export default DashboardPage;
