import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { MemberAvatar } from "@/components/avatars/member-avatar";
import { ProjectAvatar } from "@/components/avatars/project-avatar";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import "@/styles/data-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-violet-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

interface Props {
  data: Task[];
}

export const DataCalendar = ({ data }: Props) => {
  const [value, setValue] = useState<Date>(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();

    router.push(`/workspaces/${params.workspaceId}/tasks/${id}`);
  };

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };

  const events = data.map((task) => ({
    id: task.$id,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
  }));

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <div className="px-2">
            <div
              className={cn(
                "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
                statusColorMap[event.status]
              )}
              onClick={(e) => handleCardClick(e, event.id)}
            >
              <p>{event.title}</p>
              <div className="flex items-center gap-x-1">
                <MemberAvatar name={event.assignee.name} />
                <div className="size-1 rounded-full bg-neutral-300" />
                <ProjectAvatar
                  name={event.project.name}
                  image={event.project.imageUrl}
                />
              </div>
            </div>
          </div>
        ),
        toolbar: () => (
          <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
            <Button
              onClick={() => handleNavigate("PREV")}
              variant="secondary"
              size="icon"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
              <CalendarIcon className="size-4 mr-2" />
              <p className="text-sm">{format(value, "MMMM yyyy")}</p>
            </div>
            <Button
              onClick={() => handleNavigate("NEXT")}
              variant="secondary"
              size="icon"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ),
      }}
    />
  );
};
