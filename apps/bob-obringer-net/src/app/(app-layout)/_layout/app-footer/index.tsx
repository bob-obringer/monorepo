"use client";

import { cx } from "@bob-obringer/design-system";
import { useEffect } from "react";

import { FooterNav } from "@/app/(app-layout)/_layout/app-footer/footer-nav";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { ChatbotBody } from "@/features/ai-chatbot/components/chatbot-body";
import { ChatbotForm } from "@/features/ai-chatbot/components/chatbot-form";

export function AppFooter({ className }: { className?: string }) {
  const { isOpen, close } = useChatbot();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <div
      className={cx(
        className,
        "fixed bottom-0 flex w-full flex-col items-center justify-between overflow-hidden",
        "bg-opacity-50 backdrop-blur-2xl transition-all duration-500 ease-in-out",
        isOpen ? "z-20 h-svh bg-[#0D141F]" : "h-36 md:h-40",
      )}
    >
      <div className={cx(!isOpen && "hidden", "w-full flex-1 overflow-scroll")}>
        <div className="mx-auto w-full max-w-screen-md flex-1 overflow-hidden text-balance px-2 pb-28 pt-5 md:px-5 md:pb-44">
          <ChatbotBody />
        </div>
      </div>
      <footer
        className={cx(
          "border-color-tertiary fixed bottom-0 flex h-36 w-full flex-col items-center justify-end space-y-3 border-t pb-5 backdrop-blur-2xl md:h-40",
          isOpen ? "bg-color-primary" : "",
        )}
      >
        <div className="w-full max-w-screen-md space-y-4 px-5">
          <ChatbotForm />
          <FooterNav />
        </div>
      </footer>
    </div>
  );
}
