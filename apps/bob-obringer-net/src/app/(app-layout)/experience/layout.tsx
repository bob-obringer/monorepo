import { ReactNode } from "react";
import { ExperienceNav } from "@/app/(app-layout)/experience/_components/experience-nav";
import { cx } from "@bob-obringer/components";

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cx(
        "mx-auto flex w-full max-w-screen-lg flex-col space-y-2",
        "md:flex-row md:justify-center md:space-x-5 md:space-y-0 md:px-5",
      )}
    >
      <ExperienceNav className="flex-1" />
      <div className="flex-[3] px-5 md:px-0">{children}</div>
    </div>
  );
}
