import { cx, Text } from "@bob-obringer/design-system";
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
          <hr className="border-color-tertiary mb-4" />
        </>
      )}
      <div
        className={cx(
          !hasHeader && "pt-3",
          "flex flex-col space-y-10 md:flex-row md:space-x-10 md:space-y-0",
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
    <div className={cx("flex h-20 flex-col justify-center gap-1", className)}>
      <Text as="h3" variant="title-large">
        {title}
      </Text>
      <Text as="h4" variant="title-medium" color="secondary">
        {subtitle}
      </Text>
    </div>
  );
}
