"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronUp,
  faChevronDown,
} from "@awesome.me/kit-8a94ae437c/icons/sharp/solid";
import { FormEvent, ReactNode, RefObject } from "react";
import { ChatbotConfig } from "@bob-obringer/sanity-io-types";
import { cn } from "@/helpers/cn";
import { Typography } from "@bob-obringer/design-system";
import { useBobsChatbot } from "@/features/ai-chatbot/context/chat-context";

export function ChatbotForm({
  chatbotConfig,
  formRef,
}: {
  chatbotConfig: ChatbotConfig;
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const {
    input,
    handleInputChange,
    isOpen,
    open,
    handleSubmit,
    inputRef,
    status,
    close,
    stop,
  } = useBobsChatbot();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    open();
    handleSubmit();
  }

  return (
    <form onSubmit={onSubmit} className="w-full" ref={formRef}>
      <div className="bg-bg-alternate border-foreground/10 focus:bg-bg-highlight flex h-12 w-full items-center gap-x-1 rounded-lg border px-3 shadow-xl md:space-x-2">
        <input
          ref={inputRef}
          className="bg-color-transparent min-w-24 flex-1 p-0 focus:outline-0"
          value={input}
          placeholder={chatbotConfig.inputFieldPlaceholder}
          onChange={handleInputChange}
          autoFocus
        />
        {input && status === "ready" && (
          <ChatbotButton
            type="submit"
            className={
              "text-color-positive hover:text-color-positive-secondary"
            }
          >
            Ask
          </ChatbotButton>
        )}
        {["submitted", "streaming"].includes(status) && (
          <ChatbotButton
            type="button"
            onClick={stop}
            className={
              "text-warning hover:text-color-warning-secondary transition-colors"
            }
          >
            Cancel
          </ChatbotButton>
        )}
        {/* {!input && ["ready"].includes(status) && isOpen && (
          <ChatbotButton
            type="button"
            onClick={() => {
              // stop();
              // clearChat();
              inputRef.current?.focus();
            }}
            className={
              "text-text-subtle hover:text-foreground transition-colors"
            }
          >
            New Chat
          </ChatbotButton>
        )} */}
        <FontAwesomeIcon
          role="button"
          icon={isOpen ? faChevronDown : faChevronUp}
          height="16px"
          onClick={
            isOpen
              ? close
              : function () {
                  open();
                  inputRef.current?.focus();
                }
          }
          className="text-color-secondary hover:text-color-primary cursor-pointer px-1 py-2 transition-colors"
        />
      </div>
    </form>
  );
}

function ChatbotButton({
  children,
  className,
  type,
  onClick,
}: {
  children: ReactNode;
  className: string;
  type: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <Typography variant="label" asChild bold>
      <button
        type={type}
        onClick={onClick}
        className={cn(
          "flex h-[29px] items-center justify-center rounded p-2 transition-colors",
          className,
        )}
      >
        {children}
      </button>
    </Typography>
  );
}
