"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronUp,
  faChevronDown,
} from "@awesome.me/kit-8a94ae437c/icons/sharp/solid";
import { ChangeEvent, ReactNode } from "react";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { cx } from "@bob-obringer/components";
import { ChatbotConfig } from "@bob-obringer/sanity-io-types";

export function ChatbotForm({
  chatbotConfig,
}: {
  chatbotConfig: ChatbotConfig;
}) {
  const {
    isOpen,
    close,
    open,
    inputValue,
    setInputValue,
    onFormSubmit,
    inputRef,
    chatbotStatus,
    clearChat,
  } = useChatbot();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.currentTarget.value);
  }

  return (
    <form onSubmit={onFormSubmit} className="w-full">
      <div className="bg-color-secondary border-color-secondary focus:bg-color-primary flex h-12 w-full items-center gap-x-1 rounded border px-3 shadow-xl md:space-x-2">
        <input
          ref={inputRef}
          className="bg-color-transparent min-w-24 flex-1 p-0 focus:outline-0"
          value={inputValue}
          placeholder={chatbotConfig.inputFieldPlaceholder}
          onChange={handleInputChange}
        />
        {inputValue && chatbotStatus === "idle" && (
          <ChatbotButton
            type="submit"
            className={
              "text-color-positive hover:text-color-positive-secondary"
            }
          >
            Ask
          </ChatbotButton>
        )}
        {["active", "pending"].includes(chatbotStatus) && (
          <ChatbotButton
            type="submit"
            className={
              "text-color-warning hover:text-color-warning-secondary transition-colors"
            }
          >
            Cancel
          </ChatbotButton>
        )}
        {!inputValue && ["idle", "done"].includes(chatbotStatus) && isOpen && (
          <ChatbotButton
            type="button"
            onClick={() => {
              clearChat();
              inputRef.current?.focus();
            }}
            className={
              "text-color-secondary hover:text-color-primary transition-colors"
            }
          >
            New Chat
          </ChatbotButton>
        )}
        <FontAwesomeIcon
          role="button"
          icon={isOpen ? faChevronDown : faChevronUp}
          onClick={
            isOpen
              ? close
              : function () {
                  open();
                  inputRef.current?.focus();
                }
          }
          className="text-color-secondary hover:text-color-primary cursor-pointer transition-colors"
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
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "typography-label-small !font-weight-bold h-[29px] rounded p-2 transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
