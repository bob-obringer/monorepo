import { ReactNode } from "react";
import { ExperienceNav } from "@/app/(app-layout)/experience/_components/experience-nav";

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`relative mx-auto flex w-full max-w-screen-lg flex-col space-y-5 pt-5 md:flex-row md:justify-center md:space-x-10 md:space-y-0`}
    >
      <ExperienceNav className="flex-1" />
      <div className="flex-[3]">{children}</div>
    </div>
  );
}
