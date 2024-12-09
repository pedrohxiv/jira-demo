import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  color?: string;
  direction?: "horizontal" | "vertical";
  dotSize?: string;
  gapSize?: string;
  height?: string;
}

export const DottedSeparator = ({
  className,
  color = "#D4D4D8",
  direction = "horizontal",
  dotSize = "2px",
  gapSize = "6px",
  height = "2px",
}: Props) => {
  return (
    <div
      className={cn(
        className,
        direction === "horizontal"
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center"
      )}
    >
      <div
        className={direction === "horizontal" ? "flex-grow" : "flex-grow-0"}
        style={{
          width: direction === "horizontal" ? "100%" : height,
          height: direction === "horizontal" ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize:
            direction === "horizontal"
              ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
              : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
          backgroundRepeat:
            direction === "horizontal" ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
