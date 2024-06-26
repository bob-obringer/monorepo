import { tv } from "tailwind-variants";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardedRef,
  forwardRef,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";
// import type { DSComponentProps } from "../../types";
import { Slot } from "@radix-ui/react-slot";

const textVariants = tv({
  variants: {
    variant: {
      "display-large": "typography-display-large",
      "display-medium": "typography-display-medium",
      "display-small": "typography-display-small",
      "headline-large": "typography-headline-large",
      "headline-medium": "typography-headline-medium",
      "headline-small": "typography-headline-small",
      "title-large": "typography-title-large",
      "title-medium": "typography-title-medium",
      "title-small": "typography-title-small",
      "label-large": "typography-label-large",
      "label-small": "typography-label-small",
      "label-mono-large": "typography-label-mono-large",
      "label-mono-small": "typography-label-mono-small",
      "body-large": "typography-body-large",
      "body-medium": "typography-body-medium",
      "body-small": "typography-body-small",
    },
    color: {
      primary: "text-color-primary",
      secondary: "text-color-secondary",
      tertiary: "text-color-tertiary",
      protocol: "text-color-protocol",
      positive: "text-color-positive",
      negative: "text-color-negative",
      warning: "text-color-warning",
      link: "text-color-link",
      disabled: "text-color-disabled",
    },
  },
  defaultVariants: {
    variant: "body-medium",
    color: "primary",
  },
});

type ValidElement =
  | "a"
  | "button"
  | "span"
  | "p"
  | "div"
  | "label"
  | "blockquote"
  | "legend"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li"
  | "q"
  | "cite"
  | "dfn"
  | "em"
  | "abbr";

export type TextProps<As extends ValidElement> = Omit<
  ComponentPropsWithoutRef<As>,
  "variant" | "color"
> & {
  as?: As;
  asChild?: boolean;
  children?: ReactNode;
  variant?: keyof typeof textVariants.variants.variant;
  color?: keyof typeof textVariants.variants.color;
};

function Text<As extends ValidElement>(
  {
    // custom
    as,
    asChild,
    children,
    className,

    // variant props
    variant,
    color,

    // additional component props
    ...componentProps
  }: TextProps<As>,
  ref: ForwardedRef<As>,
) {
  const Component = asChild ? Slot : as || ("span" as ElementType);
  const classes = textVariants({ className, variant, color });

  return (
    <Component {...componentProps} className={classes} ref={ref}>
      {children}
    </Component>
  );
}

const _Text: ForwardRefExoticComponent<
  TextProps<ValidElement> & RefAttributes<ValidElement>
> = forwardRef(Text);

export { _Text as Text };
