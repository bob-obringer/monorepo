import { ReactNode } from "react";

export default function ExperienceCompanyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex-[3]">{children}</div>;
}
