import { ReactNode } from "react";
import { AppFooter } from "@/app/(app-layout)/_layout/app-footer";
import { AppHeader } from "@/app/(app-layout)/_layout/app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="pb-40 md:pb-44">{children}</div>
      <AppFooter />
    </>
  );
}

export const dynamic = "force-dynamic";
