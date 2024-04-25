import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { BobObringerAiProvider } from "@/features/ai/bob-obringer-ai-context";
import { bobObringerFontClasses } from "@bob-obringer/nextjs-fonts";
import { UiContextProvider } from "@/features/ui/ui-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Bob Obringer",
  description: "Product Engineer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bobObringerFontClasses}>
      <body className="bg text">
        <UiContextProvider>
          <BobObringerAiProvider>{children}</BobObringerAiProvider>
        </UiContextProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
