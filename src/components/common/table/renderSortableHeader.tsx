import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderContext } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";

/**
 *
 * @param props
 * @param title
 * @param callback
 * @returns
 */
export const renderSortableHeader = (
  props: HeaderContext<any, unknown>,
  title: string,
  className?: string
) => {
  const sortState = props.column.getIsSorted();

  return (
    <div
      className={`cursor-default select-none flex items-center justify-center space-x-2  ${className}`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={`cursor-pointer relative px-2 min-w-max text-center`}>
            {title}
            <div className="absolute right-[-16px] top-[calc(50%-6px)]">
              {sortState === "desc" ? (
                <ChevronDown className="w-3 h-3 ml-1" />
              ) : sortState === "asc" ? (
                <ChevronUp className="w-3 h-3 ml-1" />
              ) : (
                <ChevronsUpDown className="w-3 h-3 ml-1" />
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="flex items-center text-sm"
            onClick={() => props.column.toggleSorting(false)}
          >
            <ChevronUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            오름차순
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center text-sm"
            onClick={() => props.column.toggleSorting(true)}
          >
            <ChevronDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            내림차순
          </DropdownMenuItem>
          {sortState && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-sm"
                onClick={() => props.column.clearSorting()}
              >
                <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                정렬 초기화
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
