import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { BobObringerAiProvider } from "@/features/ai/bob-obringer-ai-context";
import { bobObringerFontClasses } from "@bob-obringer/nextjs-fonts";

export const metadata: Metadata = {
  title: "Bob Obringer",
  description: "Product Engineer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bobObringerFontClasses}>
      <body className="bg text">
        <BobObringerAiProvider>{children}</BobObringerAiProvider>
      </body>
    </html>
  );
}
