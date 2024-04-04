import { tv, type VariantProps } from "tailwind-variants";
import type { ReactNode } from "react";

const typographyVariants = tv({
  base: "text-",
  variants: {
    size: {
      small: "bg-red",
    },
  },
});

type TypographyVariants = VariantProps<typeof typographyVariants>;

type TypographyProps = TypographyVariants & {
  children: ReactNode;
};

export function H1(props: TypographyProps) {
  return (
    <div>
      <h1 className="">{props.children}</h1>
    </div>
  );
}
