"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { ReactNode } from "react";
import { cx } from "@bob-obringer/design-system";
import { ExperienceLayoutNav } from "@/app/(app-layout)/experience/experience-layout-nav";

export default function ResumeLayout({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const selectedCompany = segments[0];
  const hasSelectedCompany = Boolean(selectedCompany);

  return (
    <div className="flex w-full flex-col justify-center overflow-hidden md:flex-row">
      <ExperienceLayoutNav selectedCompany={selectedCompany} />
      <div
        className={cx(
          hasSelectedCompany
            ? "w-auto px-5 pt-5 md:max-w-md md:flex-1 md:px-12 lg:max-w-screen-sm"
            : "w-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
