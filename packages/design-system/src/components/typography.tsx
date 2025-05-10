import {
  cva,
  type VariantProps as CVAVariantProps,
} from "class-variance-authority";
import { cn } from "../utilities/cn";
import {
  type ElementType,
  type HTMLAttributes,
  type Ref,
  type ThHTMLAttributes,
} from "react";
import { Slot } from "@radix-ui/react-slot";

const typographyVariants = cva("", {
  variants: {
    variant: {
      display:
        "font-display font-bold !leading-[1.0] text-[clamp(3rem,10vw,4.5rem)]",
      "heading-1":
        "font-sans font-semibold !leading-[1.0] text-[clamp(2.25rem,7vw,3.25rem)]",
      "heading-2":
        "font-sans font-semibold !leading-[1.05] text-[clamp(1.5rem,5vw,2.25rem)]",
      "heading-3":
        "font-sans font-semibold !leading-[1.1] text-[clamp(1.125rem,4vw,1.5rem)]",
      "heading-4":
        "font-sans font-semibold !leading-[1.15] text-[clamp(0.875rem,3vw,1.125rem)]",
      title: "font-sans font-semibold text-lg",
      lead: "font-sans text-base italic text-subtle",
      "body-large": "font-sans text-lg",
      "body-medium": "font-sans text-base",
      "body-small": "font-sans text-sm",
      caption: "font-sans text-xs text-subtle",
      label: "font-sans text-sm uppercase text-subtle",
    },
    color: {
      bright: "text-foreground",
      subtle: "text-text-subtle",
      faint: "text-text-faint",
      brand: "text-brand",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
    },
    medium: {
      true: "font-medium",
    },
    semibold: {
      true: "font-semibold",
    },
    bold: {
      true: "font-bold",
    },
    italic: {
      false: "not-italic",
      true: "italic",
    },
    underline: {
      false: "no-underline",
      true: "underline",
    },
    lineThrough: {
      false: "no-underline",
      true: "line-through",
    },
    uppercase: {
      false: "normal-case",
      true: "uppercase",
    },
    lowercase: {
      false: "normal-case",
      true: "lowercase",
    },
    capitalize: {
      false: "normal-case",
      true: "capitalize",
    },
    left: {
      true: "text-left",
    },
    right: {
      true: "text-right",
    },
    center: {
      true: "text-center",
    },
    balance: {
      true: "text-balance",
    },
    pretty: {
      true: "text-pretty",
    },
    nowrap: {
      true: "text-nowrap",
    },
    overflowHidden: {
      true: "overflow-hidden",
    },
    clip: {
      true: "overflow-clip",
    },
    ellipsis: {
      true: "overflow-hidden overflow-ellipsis",
    },
    clamp: {
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      5: "line-clamp-5",
      6: "line-clamp-6",
    },
    margin: {
      true: "not-first:typography-margin",
    },
    srOnly: {
      true: "sr-only",
    },
  },
});

type VariantProps = CVAVariantProps<typeof typographyVariants>;

/**
 * Props for typography components
 * @param variant Typography variant
 * @param margin Typography margin
 * @param className Additional className
 */
export type TypographyProps<T> = VariantProps & {
  as?: ElementType;
  asChild?: boolean;
  className?: string;
  ref?: Ref<T>;
} & HTMLAttributes<T>;

/**
 * H1 Typography component
 * @param props TypographyProps<HTMLHeadingElement>
 * @default variant: "title1"
 */
export function H1({
  variant = "heading-1",
  ...props
}: TypographyProps<HTMLHeadingElement>) {
  return <Typography as="h1" variant={variant} {...props} />;
}

/**
 * H2 Typography component
 * @param props TypographyProps<HTMLHeadingElement>
 * @default variant: "title2"
 */
export function H2({
  variant = "heading-2",
  ...props
}: TypographyProps<HTMLHeadingElement>) {
  return <Typography as="h2" variant={variant} {...props} />;
}

/**
 * H3 Typography component
 * @param props TypographyProps<HTMLHeadingElement>
 * @default variant: "title3"
 */
export function H3({
  variant = "heading-3",
  ...props
}: TypographyProps<HTMLHeadingElement>) {
  return <Typography as="h3" variant={variant} {...props} />;
}

/**
 * H4 Typography component
 * @param props TypographyProps<HTMLHeadingElement>
 * @default variant: "title4"
 */
export function H4({
  variant = "heading-4",
  ...props
}: TypographyProps<HTMLHeadingElement>) {
  return <Typography as="h4" variant={variant} {...props} />;
}

/**
 * P Typography component
 * @param props TypographyProps<HTMLParagraphElement>
 * @default variant: "body-medium"
 */
export function P({
  variant = "body-medium",
  margin = true,
  ...props
}: TypographyProps<HTMLParagraphElement>) {
  return <Typography as="p" variant={variant} margin={margin} {...props} />;
}

/**
 * Span Typography component
 * @param props TypographyProps<HTMLSpanElement>
 * @default variant: "body-medium"
 */
export function Span({
  variant = "body-medium",
  ...props
}: TypographyProps<HTMLSpanElement>) {
  return <Typography as="span" variant={variant} {...props} />;
}

/**
 * Div Typography component
 * @param props TypographyProps<HTMLDivElement>
 * @default variant: "body-medium"
 */
export function Div({
  variant = "body-medium",
  ...props
}: TypographyProps<HTMLDivElement>) {
  return <Typography as="div" variant={variant} {...props} />;
}

/**
 * TH Typography component
 * @param props TypographyProps<HTMLTableHeaderElement>
 * @default variant: "body-medium"
 */
export function TH({
  variant = "body-medium",
  ...props
}: TypographyProps<HTMLTableCellElement> &
  ThHTMLAttributes<HTMLTableCellElement>) {
  return <Typography as="th" variant={variant} {...props} />;
}

/**
 * TD Typography component
 * @param props TypographyProps<HTMLTableCellElement>
 * @default variant: "body-medium"
 */
export function TD({
  variant = "body-medium",
  ...props
}: TypographyProps<HTMLTableCellElement>) {
  return <Typography as="td" variant={variant} {...props} />;
}

/**
 * Generic Typography component for non-semantic or dynamic elements
 * @param props TypographyProps<HTMLElement>
 *
 * TODO: Implement runtime checks in development mode to warn developers when conflicting props are used (e.g., bold and semibold, left and center).
 */
export function Typography({
  as: Component = "span",
  asChild,
  variant,
  margin,
  color,
  medium,
  semibold,
  bold,
  italic,
  underline,
  lineThrough,
  uppercase,
  lowercase,
  capitalize,
  left,
  right,
  center,
  balance,
  pretty,
  nowrap,
  overflowHidden,
  clip,
  ellipsis,
  clamp,
  srOnly,
  className,
  ...props
}: TypographyProps<HTMLElement>) {
  const Comp = asChild ? Slot : Component;

  return (
    <Comp
      className={cn(
        typographyVariants({
          variant,
          margin,
          color,
          medium,
          semibold,
          bold,
          italic,
          underline,
          lineThrough,
          uppercase,
          lowercase,
          capitalize,
          left,
          right,
          center,
          balance,
          pretty,
          nowrap,
          overflowHidden,
          clip,
          ellipsis,
          clamp,
          srOnly,
        }),
        className,
      )}
      {...props}
    />
  );
}
