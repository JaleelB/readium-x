"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { Layout, OrderBy } from "./bookmark-list";
import { useToast } from "@/components/ui/use-toast";

export function BookmarksDisplayMenu({
  layout,
  setLayout,
  orderBy,
  setOrderBy,
}: {
  layout: Layout;
  setLayout: (layout: Layout) => void;
  orderBy: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
}) {
  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const { toast } = useToast();

  const handleSetDefault = () => {
    toast({
      description: "Your current display settings have been set as default.",
    });
  };

  const handleResetToDefaults = () => {
    setLayout("grid");
    setOrderBy("date");
    toast({
      description: "Display settings have been reset to defaults.",
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DropdownMenuTrigger asChild className="bg-background">
        <Button
          className={cn(
            "gap-2 rounded-[0.5rem] border border-input bg-background py-2 text-sm font-normal text-primary shadow-sm transition-all hover:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          )}
        >
          <Icons.filter className={"h-4 w-4 text-muted-foreground"} />
          <span>Display</span>
          <Icons.chevronDown
            className={`h-4 w-4 text-muted-foreground transition duration-200 ${
              open ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:w-90 w-full divide-y divide-border p-0 text-sm">
        <DropdownMenuItem
          className={cn(
            "grid grid-cols-2 gap-2 p-3 hover:bg-background focus:bg-background",
          )}
        >
          <Button
            variant="outline"
            className={cn(
              `flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-transparent transition-colors ${layout === "grid" ? "border border-muted-foreground bg-muted text-muted-foreground" : ""}`,
            )}
            aria-pressed={layout === "grid"}
            onClick={() => setLayout("grid")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-grid-2x2 h-5 w-5 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M3 12h18"></path>
              <path d="M12 3v18"></path>
            </svg>
            Grid
          </Button>
          <Button
            variant="outline"
            className={cn(
              `flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-transparent transition-colors ${layout === "rows" ? "border border-muted-foreground bg-muted text-muted-foreground" : ""}`,
            )}
            aria-pressed={layout === "rows"}
            onClick={() => setLayout("rows")}
          >
            <svg
              height="18"
              width="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
            >
              <g fill="currentColor">
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  x1="1.75"
                  x2="16.25"
                  y1="6.75"
                  y2="6.75"
                ></line>
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  x1="1.75"
                  x2="16.25"
                  y1="11.25"
                  y2="11.25"
                ></line>
                <rect
                  height="12.5"
                  width="14.5"
                  fill="none"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  x="1.75"
                  y="2.75"
                ></rect>
              </g>
            </svg>
            Rows
          </Button>
        </DropdownMenuItem>
        <DropdownMenuGroup
          className={cn(
            "flex w-full justify-between p-0 hover:bg-background focus:bg-background",
          )}
        >
          <Popover
            open={openPopover}
            onOpenChange={(isOpen) => setOpenPopover(isOpen)}
          >
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex h-16 w-full items-center justify-between gap-2 px-4",
                )}
              >
                <span className="flex items-center gap-2">
                  <svg
                    height="18"
                    width="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <g fill="currentColor">
                      <polyline
                        fill="none"
                        points="8.5 12.5 11.75 15.75 15 12.5"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                      ></polyline>
                      <polyline
                        fill="none"
                        points="3 5.5 6.25 2.25 9.5 5.5"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                      ></polyline>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        x1="11.75"
                        x2="11.75"
                        y1="15.75"
                        y2="7.75"
                      ></line>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        x1="6.25"
                        x2="6.25"
                        y1="2.25"
                        y2="10.25"
                      ></line>
                    </g>
                  </svg>
                  Ordering
                </span>
                <Button variant="outline" className={cn("gap-2")}>
                  {orderBy === "date"
                    ? "By Date (Most Recent)"
                    : orderBy === "readTime"
                      ? "By Read Time"
                      : "Alphabetically by Title"}{" "}
                  <Icons.chevronDown
                    className={`h-4 w-4 text-muted-foreground transition duration-200 ${
                      openPopover ? "rotate-180 transform" : ""
                    }`}
                  />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-full p-2 md:w-fit">
              <OrderButton
                name="By Date (Most Recent)"
                active={orderBy === "date"}
                onClick={() => setOrderBy("date")}
              />
              <OrderButton
                name="By Read Time"
                active={orderBy === "readTime"}
                onClick={() => setOrderBy("readTime")}
              />
              <OrderButton
                name="Alphabetically by Title"
                active={orderBy === "title"}
                onClick={() => setOrderBy("title")}
              />
            </PopoverContent>
          </Popover>
        </DropdownMenuGroup>
        <DropdownMenuItem
          className={cn(
            "flex justify-end gap-2 py-2 hover:bg-background focus:bg-background",
          )}
        >
          <Button size="sm" variant="ghost" onClick={handleResetToDefaults}>
            Reset to defaults
          </Button>
          <Button size="sm" onClick={handleSetDefault}>
            Set as default
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OrderButton({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between space-x-2 rounded-md px-2 py-2 text-sm active:bg-gray-200",
      )}
    >
      <div className="flex items-center justify-start space-x-2 truncate">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-list-minus h-4 w-4"
        >
          <path d="M11 12H3"></path>
          <path d="M16 6H3"></path>
          <path d="M16 18H3"></path>
          <path d="M21 12h-6"></path>
        </svg>
        <p className="truncate text-sm font-medium">{name}</p>
      </div>
      {active && (
        <svg
          fill="none"
          shape-rendering="geometricPrecision"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          className="h-4 w-4"
        >
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      )}
    </Button>
  );
}
