"use client";

import { cx, Text } from "@bob-obringer/design-system";
import { useEffect, useRef, useState } from "react";

import { FooterNav } from "@/app/(app-layout)/_layout/app-footer/footer-nav";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { ChatbotBody } from "@/features/ai-chatbot/components/chatbot-body";
import { ChatbotForm } from "@/features/ai-chatbot/components/chatbot-form";
import { useSelectedLayoutSegments } from "next/navigation";

export function AppFooter({ className }: { className?: string }) {
  const { isOpen, close, submitMessage } = useChatbot();
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

  function handleAskClick(question: string) {
    submitMessage(question);
  }

  return (
    <div
      className={cx(
        className,
        "fixed bottom-0 flex w-full flex-col items-center justify-between overflow-hidden",
        "bg-opacity-50 backdrop-blur-2xl transition-all duration-300 ease-in-out",
        isOpen ? "z-20 h-svh bg-[#0D141F]" : "h-36 md:h-40",
        isHome && !isOpen ? "z-20 h-[60svh] md:h-[60svh]" : "",
      )}
    >
      <div
        ref={chatbotScrollerRef}
        className={cx(!isOpen && "hidden", "w-full flex-1 overflow-scroll")}
      >
        <div className="mx-auto w-full max-w-screen-md flex-1 overflow-hidden text-balance px-2 pb-28 pt-5 md:px-5 md:pb-44">
          <ChatbotBody scrollerRef={chatbotScrollerRef} />
        </div>
      </div>
      <footer
        className={cx(
          "border-color-tertiary border-opacity-1 fixed bottom-0 h-36 w-full flex-col items-center border-t pb-5 pt-3 backdrop-blur-2xl transition-all duration-300 md:h-40",
          isOpen ? "bg-color-primary" : "",
          isHome && !isOpen && "h-[60svh] border-opacity-0 md:h-[60svh]",
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-screen-md flex-col items-center justify-between px-5">
          <div className="w-full">
            <ChatbotForm />
            {!isOpen && isHome && (
              <Carousel onAskClick={handleAskClick} strings={chatTips} />
            )}
          </div>
          <FooterNav />
        </div>
      </footer>
    </div>
  );
}

function Carousel({
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
            className={cx(
              "absolute left-0 top-0 flex h-full w-full flex-col items-center gap-2 px-10 pt-4 text-center opacity-0 transition-opacity duration-700 ease-in-out",
              isActive && "opacity-100",
            )}
          >
            <Text
              color="secondary"
              className={`relative block max-w-lg text-balance text-center`}
            >
              {string}
            </Text>
            <Text
              role={isActive ? "button" : undefined}
              color="link"
              variant="body-small"
              className={cx(
                "relative block",
                isActive && "z-10 cursor-pointer",
              )}
              onClick={isActive ? () => onAskClick(string) : undefined}
            >
              Ask this question
            </Text>
          </div>
        );
      })}
    </div>
  );
}

const chatTips = [
  "How many years of experience does Bob have in web development, and what technologies has he seen evolve over that time?",
  "What is Bob's passion in the professional world, and which startups has he worked with?",
  "What new field is Bob eager to transition into, and how does he plan to leverage his background in web development?",
  "What experience does Bob have in the blockchain industry, and what specific projects has he worked on?",
  "What role did Bob play at Sona, and what features did he develop for the streaming music app and marketplace?",
  "How has Bob demonstrated his ability to optimize web performance, particularly at Jet.com?",
  "How has Bob ensured that websites are accessible, and can you give an example of a project where he added accessibility features?",
  "What custom UI frameworks has Bob developed, and where did he implement them?",
  "What leadership roles has Bob held, and what were his responsibilities in those positions?",
  "How can I contact Bob?",
  "Does Bob have a resume I can download?",
  "Can you tell me a bit about Bob's family and pets?",
];
