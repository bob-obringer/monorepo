"use client";

import { Span } from "@bob-obringer/design-system";
import { useEffect, useRef, useState } from "react";
import { FooterNav } from "@/app/_/layout/app-footer/footer-nav";
import { ChatbotBody } from "@/features/ai-chatbot/components/chatbot-body";
import { ChatbotForm } from "@/features/ai-chatbot/components/chatbot-form";
import { useSelectedLayoutSegments } from "next/navigation";
import { ChatbotConfig } from "@bob-obringer/sanity-io-types";
import { cn } from "@/helpers/cn";
import { useBobsChatbot } from "@/features/ai-chatbot/context/chat-context";

export function Footer({
  className,
  chatbotConfig,
}: {
  className?: string;
  chatbotConfig: ChatbotConfig;
}) {
  // const { isOpen, close, submitMessage } = useChatbot();
  const { isOpen, close, setInput } = useBobsChatbot();

  const segments = useSelectedLayoutSegments();
  const isHome = segments.length === 0;

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

  const chatbotScrollerRef = useRef<HTMLDivElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // this is a terrible hack, but the form won't submit properly if I try to do it from here
  function handleAskClick(question: string) {
    setInput(question);

    // Small delay to ensure input is updated
    setTimeout(() => {
      const submitButton = formRef.current?.querySelector(
        'button[type="submit"]',
      );
      if (submitButton) {
        (submitButton as HTMLButtonElement).click();
      }
    }, 10);
  }

  return (
    <div
      className={cn(
        className,
        "fixed bottom-0 flex w-full flex-col items-center justify-between overflow-hidden",
        "bg-background transition-all duration-300 ease-in-out",
        isOpen
          ? "bg-bg-alternate z-20 h-svh bg-opacity-50 backdrop-blur-2xl"
          : "h-36 backdrop-blur-lg md:h-40",
        isHome && !isOpen ? "z-20 h-[60svh] md:h-[60svh]" : "",
      )}
    >
      <div
        ref={chatbotScrollerRef}
        className={cn(!isOpen && "hidden", "w-full flex-1 overflow-scroll")}
      >
        <div className="mx-auto w-full max-w-screen-md flex-1 overflow-hidden text-balance px-2 pb-28 pt-5 md:px-5 md:pb-44">
          <ChatbotBody scrollerRef={chatbotScrollerRef} />
        </div>
      </div>
      <footer
        className={cn(
          "fixed bottom-0 h-36 w-full flex-col items-center border-t pb-5 pt-3 transition-all duration-300 md:h-40",
          isOpen ? "bg-bg-footer" : "",
          isHome && !isOpen
            ? "border-text-subtle/0 h-[60svh] md:h-[60svh]"
            : "border-text-subtle/20",
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-screen-md flex-col items-center justify-between px-5">
          <div className="w-full">
            <ChatbotForm chatbotConfig={chatbotConfig} formRef={formRef} />
            {!isOpen && isHome && (
              <MessageCarousel
                onAskClick={handleAskClick}
                strings={chatbotConfig.suggestedQuestions ?? []}
              />
            )}
          </div>
          <FooterNav />
        </div>
      </footer>
    </div>
  );
}

function MessageCarousel({
  strings,
  onAskClick,
}: {
  strings: Array<string>;
  onAskClick: (question: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * strings.length));
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [strings]);

  return (
    <div className="relative">
      {strings.map((string, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={index}
            className={cn(
              "absolute left-0 top-0 flex h-full w-full flex-col items-center gap-2 px-10 pt-4 text-center opacity-0 transition-opacity duration-700 ease-in-out",
              isActive && "opacity-100",
            )}
          >
            <Span
              color="bright"
              className={`relative block max-w-lg text-balance text-center`}
            >
              {string}
            </Span>
            <Span
              role={isActive ? "button" : undefined}
              color="brand"
              variant="body-small"
              className={cn(
                "relative block",
                isActive && "z-10 cursor-pointer",
              )}
              onClick={isActive ? () => onAskClick(string) : undefined}
            >
              Ask this question
            </Span>
          </div>
        );
      })}
    </div>
  );
}
