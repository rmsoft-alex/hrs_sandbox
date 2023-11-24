import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  icon: React.ReactElement;
  content: React.ReactElement | string;
  className?: string;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "end" | "start";
  orange?: boolean;
}

const TooltipIcon = ({
  icon,
  content,
  className,
  orange = false,
  align,
  side,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent
          className={cn(
            ` select-none font-medium break-keep ${
              orange
                ? "relative bg-gradient-to-br from-orange-300 to-orange-500 text-white p-3 border-none rounded-md "
                : "p-1"
            } ${className}`
          )}
          side={side ? side : orange ? "bottom" : "top"}
          align={align ? align : orange ? "start" : "center"}
          sideOffset={orange ? 10 : 5}
          alignOffset={-5}
        >
          {orange && (
            <div
              className={`absolute top-[-18px] left-1 w-2 h-4 border-[10px] border-transparent border-b-orange-300`}
            ></div>
          )}
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipIcon;
