import { ReactNode } from "react";
import { AppFooter } from "@/app/(app-layout)/app-footer";
import { AppHeader } from "@/app/(app-layout)/app-header";
import { cx, Text } from "@bob-obringer/design-system";

const alertMessage = "";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {alertMessage && <Alert>{alertMessage}</Alert>}
      <AppHeader className={cx(alertMessage ? "mt-10" : "mt-0")} />
      <div className="pb-32 md:pb-40">{children}</div>
      <AppFooter />
    </>
  );
}

function Alert({ children }: { children: ReactNode }) {
  return (
    <Text
      variant="body-large"
      as="div"
      className="bg-color-tertiary text-color-warning fixed left-0 right-0 top-0 z-10 flex h-10 items-center justify-center bg-opacity-50 backdrop-blur-md"
    >
      {children}
    </Text>
  );
}
