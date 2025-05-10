import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { AppUIProvider } from "@/features/ui/app-ui-state-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { env } from "@/config/client";
import { PosthogProvider } from "@bob-obringer/nextjs-posthog";
import { getDocument } from "@/services/sanity-io-client";
import { ChatbotContextProvider } from "@/features/ai-chatbot/context/chatbot-context";

import { Montserrat, Reddit_Mono, Ysabeau_SC } from "next/font/google";

const display = Ysabeau_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
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
    <html lang="en" className={fontClasses}>
      <body className="bg-color-tertiary text">
        <PosthogProvider
          token={env.posthog.key}
          host={env.posthog.host}
          enabled={env.name === "production"}
        >
          <AppUIProvider>
            <ChatbotContextProvider>{children}</ChatbotContextProvider>
          </AppUIProvider>
        </PosthogProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
