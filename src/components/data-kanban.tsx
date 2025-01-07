import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskActions } from "@/components/task-actions";
import { TaskDate } from "@/components/task-date";
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
  onChange: (
    tasks: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[]
  ) => void;
}

export const DataKanban = ({ data, onChange }: Props) => {
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

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const sourceStatus = result.source.droppableId as TaskStatus;
      const destinationStatus = result.destination.droppableId as TaskStatus;

      let updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        const sourceColumn = [...newTasks[sourceStatus]];

        const [movedTask] = sourceColumn.splice(result.source.index, 1);

        if (!movedTask) {
          return prevTasks;
        }

        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destinationColumn = [...newTasks[destinationStatus]];

        destinationColumn.splice(
          result.destination!.index,
          0,
          updatedMovedTask
        );

        newTasks[destinationStatus] = destinationColumn;

        updatesPayload = [];

        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destinationStatus,
          position: Math.min((result.destination!.index + 1) * 1000, 1_000_000),
        });

        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);

              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
            <Droppable droppableId={board}>
              {({ droppableProps, innerRef, placeholder }) => (
                <div
                  {...droppableProps}
                  ref={innerRef}
                  className="min-h-[200px] py-1.5"
                >
                  {tasks[board].map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {({ draggableProps, dragHandleProps, innerRef }) => (
                        <div
                          {...draggableProps}
                          {...dragHandleProps}
                          ref={innerRef}
                        >
                          <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-x-2">
                              <p className="text-sm line-clamp-2">
                                {task.name}
                              </p>
                              <TaskActions task={task}>
                                <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition cursor-pointer" />
                              </TaskActions>
                            </div>
                            <DottedSeparator />
                            <div className="flex items-center gap-x-1.5">
                              <MemberAvatar
                                name={task.assignee.name}
                                fallbackClassName="text-[10px]"
                              />
                              <div className="size-1 rounded-full bg-neutral-300" />
                              <TaskDate
                                value={task.dueDate}
                                className="text-xs"
                              />
                            </div>
                            <div className="flex items-center gap-x-1.5">
                              <ProjectAvatar
                                name={task.project.name}
                                image={task.project.imageUrl}
                                fallbackClassName="text-[10px]"
                              />
                              <span className="text-xs font-medium">
                                {task.project.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
