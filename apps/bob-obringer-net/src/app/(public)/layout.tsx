import { AppFooter } from "@/app/_/layout/app-footer";
import { HeaderServer } from "@/app/_/layout/app-header/header-server";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderServer />
      <div className="pb-40 md:pb-44">{children}</div>
      <AppFooter />
    </>
  );
}
