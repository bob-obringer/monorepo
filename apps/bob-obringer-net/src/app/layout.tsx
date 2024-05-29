import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { bobObringerFontClasses } from "@bob-obringer/nextjs-fonts";
import { AppUIProvider } from "@/features/ui/app-ui-state-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { env } from "@/config/client";
import { PosthogProvider } from "@bob-obringer/nextjs-posthog";
import { getDocument } from "@/services/sanity-io/get-document";
import { ChatbotContextProvider } from "@/features/ai-chatbot/context/chatbot-context";

export async function generateMetadata(): Promise<Metadata> {
  const { title, subtitle } = (await getDocument("homepage")) ?? {};

  return {
    title,
    description: subtitle,
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
    <html lang="en" className={bobObringerFontClasses}>
      <body className="bg text">
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
