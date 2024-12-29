import { useQueryState } from "nuqs";

export const useTaskView = () => {
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });

  return { view, setView };
};
