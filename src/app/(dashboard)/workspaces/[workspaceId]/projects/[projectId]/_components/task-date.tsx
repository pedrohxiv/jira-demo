import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

interface Props {
  value: string;
  className?: string;
}

export const TaskDate = ({ value, className }: Props) => {
  const diffInDays = differenceInDays(new Date(value), new Date());

  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <p className={cn("truncate", textColor, className)}>
      {format(value, "PPP")}
    </p>
  );
};
