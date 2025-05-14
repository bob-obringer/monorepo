import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
// import { PosthogProvider } from "@bob-obringer/nextjs-posthog";
import { getDocument } from "@/services/sanity-io-client";

import { Montserrat, Reddit_Mono, Ysabeau_SC } from "next/font/google";
import { cn } from "@/helpers/cn";
import { AppUIProvider } from "@/features/ui/app-ui-state-context";
import { ChatContextProvider } from "@/features/ai-chatbot/context/chat-context";

const display = Ysabeau_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = Reddit_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const fontClasses = [
  body.className,
  body.variable,
  display.variable,
  mono.variable,
].join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const { title, name } = (await getDocument("aboutBob")) ?? {};

  return {
    title: name,
    description: title,
    applicationName: "bob.obringer.net",
    authors: [{ name: "Bob Obringer", url: "https://bob.obringer.net" }],
    keywords: [
      "Bob Obringer",
      "Front End Engineer",
      "Product Engineer",
      "Product Architect",
      "Software Architect",
      "Software Developer",
      "Web Developer",
      "AI Engineer",
    ],
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL("https://bob.obringer.net"),
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(fontClasses, "dark-color-mode")}>
      <body className="!bg-bg-alternate min-h-svh">
        {/* <PosthogProvider
          token={env.posthog.key}
          host={env.posthog.host}
          enabled={env.name === "production"}
        > */}
        <AppUIProvider>
          <ChatContextProvider>{children}</ChatContextProvider>
        </AppUIProvider>
        {/* </PosthogProvider> */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
