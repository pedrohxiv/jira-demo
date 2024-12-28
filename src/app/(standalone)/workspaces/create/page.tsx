import { redirect } from "next/navigation";

import { auth } from "@/actions/auth";
import { CreateWorkspaceForm } from "@/components/cards/create-workspace-form";

const CreatePage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default CreatePage;
