import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { BobObringerAiProvider } from "@/features/ai/bob-obringer-ai-context";
import { bobObringerFontClasses } from "@bob-obringer/nextjs-fonts";
import { UiStateProvider } from "@/features/ui/ui-state-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { env } from "@/config/client";
import { PosthogProvider } from "@bob-obringer/posthog-nextjs";

export const metadata: Metadata = {
  title: "Bob Obringer",
  description: "Product Engineer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bobObringerFontClasses}>
      <body className="bg text">
        <PosthogProvider token={env.posthog.key} host={env.posthog.host}>
          <UiStateProvider>
            <BobObringerAiProvider>{children}</BobObringerAiProvider>
          </UiStateProvider>
        </PosthogProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
