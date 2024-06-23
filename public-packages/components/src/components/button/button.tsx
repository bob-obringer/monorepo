"use client";

import { tv } from "tailwind-variants";
import { type ForwardedRef, forwardRef } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

type Color = "primary" | "secondary" | "positive" | "negative" | "warning";

function solid(color: Color, colorClass: string, hoverColorClass: string) {
  return {
    style: "solid" as const,
    color,
    class: [
      colorClass,
      hoverColorClass,
      "disabled:bg-color-button-disabled disabled:text-color-disabled",
      "aria-disabled:bg-color-button-disabled aria-disabled:text-color-disabled",
    ].join(" "),
  };
}

function border(color: Color, colorClass: string, hoverColorClass: string) {
  return {
    style: "bordered" as const,
    color,
    class: [
      "border",
      colorClass,
      hoverColorClass,
      "disabled:border-color-disabled disabled:text-color-disabled",
      "aria-disabled:border-color-disabled aria-disabled:text-color-disabled",
    ].join(" "),
  };
}

const buttonVariants = tv({
  base: "button appearance-none cursor-pointer transition-colors duration-200 ease-in-out py-0",
  variants: {
    style: {
      solid: "border-0 text-color-button bg-color-button",
      bordered: "border bg-color-transparent",
      text: "border-0 bg-color-transparent",
    },
    color: {
      primary: "text-color-button",
      secondary: "text-color-button-secondary",
      positive: "text-color-positive",
      negative: "text-color-negative",
      warning: "text-color-warning",
    },
    size: {
      small: "h-6 px-2 font-family-mono uppercase text-size-sm leading-widest",
      medium: "h-8 px-4 font-family-mono uppercase text-size-md leading-wider",
      large: "h-12 px-6 font-family-body text-size-lg font-weight-medium",
    },
  },
  compoundVariants: [
    solid("primary", "bg-color-button", "hover:bg-color-button-hover"),
    solid(
      "secondary",
      "bg-color-button-secondary",
      "hover:bg-color-button-secondary-hover",
    ),
    solid(
      "positive",
      "bg-color-button-positive",
      "hover:bg-color-button-positive-hover",
    ),
    solid(
      "negative",
      "bg-color-button-negative",
      "hover:bg-color-button-negative-hover",
    ),
    solid(
      "warning",
      "bg-color-button-warning",
      "hover:bg-color-button-warning-hover",
    ),
    border(
      "primary",
      "border-color-button text-color-button-secondary",
      "hover:border-color-button-hover",
    ),
    border(
      "secondary",
      "border-color-button-secondary text-color-button-secondary",
      "hover:border-color-button-secondary-hover",
    ),
    border(
      "positive",
      "border-color-button-positive",
      "hover:border-color-button-positive-hover",
    ),
    border(
      "negative",
      "border-color-button-negative",
      "hover:border-color-button-negative-hover",
    ),
    border(
      "warning",
      "border-color-button-warning",
      "hover:border-color-button-warning-hover",
    ),
  ],
  defaultVariants: {
    style: "solid",
    color: "secondary",
    size: "medium",
  },
});

export type ButtonProps = AriaButtonProps & {
  className?: string;
  style?: keyof typeof buttonVariants.variants.style;
  color?: keyof typeof buttonVariants.variants.color;
  size?: keyof typeof buttonVariants.variants.size;
};

function Button(
  { style, color, size, className, ...componentProps }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  // const classes = buttonVariants({ className, style, color, size });
  return (
    <AriaButton
      {...componentProps}
      className="lightMode-color-scheme typography-label-mono-small"
      // className={classes}
      ref={ref}
    />
  );
}

const _Button = forwardRef(Button);

export { _Button as Button };
