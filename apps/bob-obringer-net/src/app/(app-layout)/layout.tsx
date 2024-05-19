import { ReactNode } from "react";
import { AppFooter } from "@/app/(app-layout)/_layout/app-footer";
import { AppHeader } from "@/app/(app-layout)/app-header";
import { ChatbotContextProvider } from "@/features/ai-chatbot";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="pb-40 md:pb-44">{children}</div>
      <ChatbotContextProvider>
        <AppFooter />
      </ChatbotContextProvider>
    </>
  );
}
