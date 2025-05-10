import { ReactNode } from "react";
import { ExperienceNav } from "@/app/experience/_components/experience-nav";
import { cn } from "@/helpers/cn";

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col space-y-2 lg:container lg:mx-auto",
        "lg:flex-row lg:justify-center lg:gap-x-5 lg:space-y-0 lg:px-5",
      )}
    >
      <ExperienceNav className="flex-1" />
      <div className="container mx-auto flex-[3] px-5 lg:px-0">{children}</div>
    </div>
  );
}
