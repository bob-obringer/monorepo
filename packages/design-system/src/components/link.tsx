import { cva, type VariantProps } from "class-variance-authority";
import { Typography, type TypographyProps } from "./typography";
import { cn } from "../utilities/cn";

const linkVariants = cva("transition-colors", {
  variants: {
    hover: {
      none: "",
      brand: "hover:text-brand",
      neutral: "hover:text-bright",
    },
  },
  defaultVariants: {
    hover: "neutral",
  },
});

export type LinkTextProps = Omit<TypographyProps<HTMLAnchorElement>, "as"> &
  VariantProps<typeof linkVariants>;

export function LinkText({
  hover,
  color = "subtle",
  className,
  asChild,
  ...props
}: LinkTextProps) {
  const variantClass = cn(linkVariants({ hover }), className);
  return (
    <Typography
      color={color}
      className={variantClass}
      asChild={asChild}
      {...props}
    />
  );
}
