import { createSessionClient } from "@/lib/appwrite";

export const auth = async () => {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch {
    return null;
  }
};
