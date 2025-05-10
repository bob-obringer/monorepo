"use client";

import "@/features/ai-chatbot/components/chatbot.css";
import { RefObject, useEffect, useRef } from "react";

import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";

import { Div } from "@bob-obringer/design-system";
import { ChatbotMessage } from "@/features/ai-chatbot/components/chatbot-message";

export function ChatbotBody({
  scrollerRef,
}: {
  scrollerRef: RefObject<HTMLDivElement | null>;
}) {
  const { messages, chatbotStatus } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement | null>(null);

  const isManuallyScrolled = useRef(false);

  useEffect(() => {
    if (
      chatbotStatus === "idle" ||
      chatbotStatus === "pending" ||
      chatbotStatus === "active"
    ) {
      isManuallyScrolled.current = false;
    }
  }, [chatbotStatus, messages.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    const handleScroll = () => {
      if (
        scroller &&
        scroller.scrollTop < scroller.scrollHeight - scroller.clientHeight
      ) {
        isManuallyScrolled.current = true;
      } else if (
        scroller &&
        scroller.scrollTop === scroller.scrollHeight - scroller.clientHeight
      ) {
        isManuallyScrolled.current = false;
      }
    };

    scroller?.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(() => {
      if (!isManuallyScrolled.current) {
        messagesEndRef.current?.scrollIntoView();
      }
    });

    const resizeDiv = resizeRef.current;
    if (resizeDiv) {
      resizeObserver.observe(resizeDiv);
    }

    return () => {
      scroller?.removeEventListener("scroll", handleScroll);
      if (resizeDiv) {
        resizeObserver.unobserve(resizeDiv);
      }
    };
  }, [scrollerRef]);

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="space-y-4 text-pretty" ref={resizeRef}>
      <Div className={"px-5 text-center"} color="subtle" variant="body-small">
        {`I'm a chatbot with an occasional wild streak.
        While I'm powered by facts, I sometimes sprinkle in a dash of
        imagination. Double-check anything important, and let's enjoy the
        conversation!`}
      </Div>
      <hr className="border-foreground/10" />
      {messages.map((m) => {
        return (
          <div key={m.id} className="whitespace-pre-wrap">
            <ChatbotMessage
              message={m}
              isLastMessage={m.id === lastMessage?.id}
            >
              {m.ui}
            </ChatbotMessage>
          </div>
        );
      })}
      <div ref={messagesEndRef} className="pb-6" />
    </div>
  );
}
