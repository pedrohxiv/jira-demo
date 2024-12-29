import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "@/lib/types";

export const useTaskFilters = () => {
  const [filters, setFilters] = useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    dueDate: parseAsString,
    search: parseAsString,
  });

  return {
    projectId: filters.projectId,
    assigneeId: filters.assigneeId,
    status: filters.status,
    dueDate: filters.dueDate,
    search: filters.search,
    setFilters,
  };
};
