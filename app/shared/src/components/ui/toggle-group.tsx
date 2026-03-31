"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type IndicatorBounds =
  | {
      height: number;
      top: number;
    }
  | {
      left: number;
      width: number;
    };

type ToggleGroupSelectionStyle = "default" | "pill";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    indicatorClassName?: string;
    spacing?: number;
    orientation?: "horizontal" | "vertical";
    registerItem: (value: string, node: HTMLButtonElement | null) => void;
    selectionStyle: ToggleGroupSelectionStyle;
  }
>({
  indicatorClassName: undefined,
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
  registerItem: () => {},
  selectionStyle: "default",
});

function getIndicatorBounds(
  button: HTMLButtonElement,
  orientation: "horizontal" | "vertical",
): IndicatorBounds {
  if (orientation === "vertical") {
    return {
      height: button.offsetHeight,
      top: button.offsetTop,
    };
  }

  return {
    left: button.offsetLeft,
    width: button.offsetWidth,
  };
}

type PillIndicatorMotionTarget =
  | { opacity: 0 }
  | { opacity: 1; width: number; x: number }
  | { height: number; opacity: 1; y: number };

function pillIndicatorMotionAnimate(
  bounds: IndicatorBounds | undefined,
): PillIndicatorMotionTarget {
  if (!bounds) {
    return { opacity: 0 };
  }
  if ("width" in bounds) {
    return { opacity: 1, width: bounds.width, x: bounds.left };
  }
  return { height: bounds.height, opacity: 1, y: bounds.top };
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function ToggleGroup({
  className,
  indicatorClassName,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    indicatorClassName?: string;
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) {
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const [indicatorBounds, setIndicatorBounds] = React.useState<
    IndicatorBounds | undefined
  >();
  const selectedValue = Array.isArray(props.value) ? props.value[0] : undefined;

  const registerItem = React.useCallback(
    (value: string, node: HTMLButtonElement | null) => {
      if (!node) {
        itemRefs.current.delete(value);
        return;
      }

      itemRefs.current.set(value, node);
    },
    [],
  );

  const updateIndicatorBounds = React.useCallback(() => {
    const selectedItem = selectedValue
      ? itemRefs.current.get(selectedValue)
      : undefined;
    if (!selectedItem) {
      setIndicatorBounds(undefined);
      return;
    }
    setIndicatorBounds(getIndicatorBounds(selectedItem, orientation));
  }, [orientation, selectedValue]);

  React.useLayoutEffect(() => {
    updateIndicatorBounds();
    window.addEventListener("resize", updateIndicatorBounds);

    return () => window.removeEventListener("resize", updateIndicatorBounds);
  }, [updateIndicatorBounds]);

  const selectionStyle: ToggleGroupSelectionStyle = indicatorClassName
    ? "pill"
    : "default";

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-selection-style={selectionStyle}
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-[size=sm]:rounded-[min(var(--radius-md),8px)] data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{
          indicatorClassName,
          variant,
          size,
          spacing,
          orientation,
          registerItem,
          selectionStyle,
        }}
      >
        {selectionStyle === "pill" ? (
          <motion.span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-0 rounded-md",
              orientation === "vertical" ? "inset-x-0" : "inset-y-0",
              indicatorClassName,
            )}
            animate={pillIndicatorMotionAnimate(indicatorBounds)}
            initial={false}
            transition={{
              type: "tween",
              duration: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ) : null}
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  TogglePrimitive.Props & VariantProps<typeof toggleVariants>
>(function ToggleGroupItem(
  { className, children, variant = "default", size = "default", ...props },
  forwardedRef,
) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      ref={(node) => {
        assignRef(forwardedRef, node);
        if (typeof props.value === "string") {
          context.registerItem(props.value, node);
        }
      }}
      data-slot="toggle-group-item"
      data-selection-style={context.selectionStyle}
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t group-data-[selection-style=pill]/toggle-group:relative group-data-[selection-style=pill]/toggle-group:z-10 group-data-[selection-style=pill]/toggle-group:aria-pressed:bg-transparent group-data-[selection-style=pill]/toggle-group:data-[state=on]:bg-transparent",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
});

export { ToggleGroup, ToggleGroupItem };
