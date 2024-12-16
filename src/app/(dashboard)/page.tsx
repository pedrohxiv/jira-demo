import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";

const DashboardPage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return null;
};

export default DashboardPage;
