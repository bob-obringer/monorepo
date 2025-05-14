import { cn } from "@/helpers/cn";
import { H3, H4 } from "@bob-obringer/design-system";
import { ReactNode } from "react";

export function ExperiencePageBody({
  body,
  sidebar,
  title,
  subtitle,
}: {
  body: ReactNode;
  sidebar: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}) {
  const hasHeader = title || subtitle;

  return (
    <main className="pb-5">
      {hasHeader && (
        <>
          <ExperiencePageTitle title={title} subtitle={subtitle} />
          <hr className="border-foreground/20 mb-4" />
        </>
      )}
      <div
        className={cn(
          !hasHeader && "pt-3",
          "flex flex-col space-y-10 lg:flex-row lg:space-x-10 lg:space-y-0",
        )}
      >
        <div className="flex-[2]">{body}</div>
        <div className="flex-[1]">{sidebar}</div>
      </div>
    </main>
  );
}

function ExperiencePageTitle({
  title,
  subtitle,
  className,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-20 flex-col justify-center gap-1", className)}>
      <H3>{title}</H3>
      <H4>{subtitle}</H4>
    </div>
  );
}
