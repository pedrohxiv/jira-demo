import { DragDropContext } from "@hello-pangea/dnd";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCreateTask } from "@/hooks/use-create-task";
import { boards } from "@/lib/constants";
import { Task, TasksState, TaskStatus } from "@/lib/types";
import { snakeCaseToTitleCase } from "@/lib/utils";

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashed className="size-[18px] text-violet-400" />
  ),
  [TaskStatus.TODO]: <Circle className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashed className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleDot className="size-[18px] text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheck className="size-[18px] text-emerald-400" />,
};

interface Props {
  data: Task[];
}

export const DataKanban = ({ data }: Props) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  const { open } = useCreateTask();

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <div className="px-2 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                {statusIconMap[board]}
                <h2 className="text-sm font-medium">
                  {snakeCaseToTitleCase(board)}
                </h2>
                <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                  {tasks[board].length}
                </div>
              </div>
              <Button
                onClick={open}
                variant="ghost"
                size="icon"
                className="size-5"
              >
                <Plus className="size-4 text-neutral-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
