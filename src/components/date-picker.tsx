"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const DatePicker = React.forwardRef<HTMLButtonElement, Props>(
  (
    { value, onChange, className, disabled, placeholder = "Select date" },
    ref
  ) => {
    return (
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "lg",
            }),
            "w-full justify-start text-left font-normal px-3",
            {
              "text-muted-foreground": !value,
              "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground":
                disabled,
            },
            className
          )}
          ref={ref}
        >
          <CalendarIcon className="size-4 mr-0.5" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {!disabled && (
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => onChange(date as Date)}
              initialFocus
            />
          )}
        </PopoverContent>
      </Popover>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
