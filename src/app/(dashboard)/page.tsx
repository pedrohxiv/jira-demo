import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { CreateWorkspaceForm } from "@/components/create-workspace-form";

const DashboardPage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <CreateWorkspaceForm />;
};

export default DashboardPage;
