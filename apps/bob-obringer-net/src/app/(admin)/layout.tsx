import { ReactNode } from "react";
import Link from "next/link";
import { H1 } from "@bob-obringer/design-system";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = await headers();

  const clientIp =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ?? "";

  const allowedIpsEnv = process.env.ALLOWED_ADMIN_IPS;
  const allowedIps = allowedIpsEnv
    ? allowedIpsEnv.split(",").map((ip) => ip.trim())
    : [];

  // Strict check: if env var is not defined OR IP is not in list, then 404.
  // This means admin routes are inaccessible if ALLOWED_ADMIN_IPS is not set.
  if (!allowedIpsEnv || !allowedIps.includes(clientIp)) {
    console.warn(
      `Admin Access: IP ${clientIp} attempt. Allowed: [${allowedIps.join(", ")}]. Env: ${allowedIpsEnv ? "Set" : "Not Set"}. Access ${!allowedIpsEnv || !allowedIps.includes(clientIp) ? "Denied" : "Allowed (logic error somewhere if this shows for allowed)"}.`,
    );
    notFound();
  }

  return (
    <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
      {/* Fixed top navigation - exactly 64px height */}
      <header className="bg-bg bg-bg-highlight z-10 h-16 flex-shrink-0 shadow-sm">
        <div className="h-full w-full px-4">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center">
              <H1 variant="title" className="text-foreground">
                Admin Dashboard
              </H1>
            </div>
            <nav className="ml-6 flex space-x-4">
              <Link
                href="/admin/chats"
                className="text-text-subtle hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
              >
                Chat Archives
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page content - fills remaining screen height exactly */}
      <main className="w-full flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
