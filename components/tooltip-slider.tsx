"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TooltipSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [value, setValue] = React.useState<number[]>(
    Array.isArray(props.defaultValue)
      ? props.defaultValue
      : props.defaultValue !== undefined
        ? [props.defaultValue as number]
        : [0],
  );

  return (
    <TooltipProvider>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
        onValueChange={(newValue) => {
          setValue(newValue);
          props.onValueChange?.(newValue);
        }}
        {...props}
      >
        <>
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <Tooltip>
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb className="block h-3.5 w-3.5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
            </TooltipTrigger>
            <TooltipContent
              className="rounded bg-secondary px-2 py-1 text-sm text-secondary-foreground"
              side="top"
            >
              {value[0]}
            </TooltipContent>
          </Tooltip>
        </>
      </SliderPrimitive.Root>
    </TooltipProvider>
  );
});
TooltipSlider.displayName = SliderPrimitive.Root.displayName;

export { TooltipSlider };
