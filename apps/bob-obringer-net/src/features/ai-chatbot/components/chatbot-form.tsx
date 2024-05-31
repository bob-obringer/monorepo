"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretDown,
  faSquareCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, ReactNode } from "react";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { cx } from "@bob-obringer/design-system";

export function ChatbotForm() {
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
      <div className="bg-color-secondary flex w-full items-center space-x-1 rounded border border-[#333333] p-2 shadow-xl focus:outline-1 md:space-x-2">
        <input
          ref={inputRef}
          className="bg-color-transparent min-w-24 flex-1 p-0 pl-2 shadow-xl focus:outline-0"
          value={inputValue}
          placeholder="Ask me about Bob!"
          onChange={handleInputChange}
        />
        {inputValue && chatbotStatus === "idle" && (
          <ChatbotButton
            type="submit"
            className="bg-[#1B537B] text-[#75C7F0] hover:bg-[#1F6692]"
          >
            Ask
          </ChatbotButton>
        )}
        {["active", "pending"].includes(chatbotStatus) && (
          <ChatbotButton
            type="submit"
            className="bg-[#7B531B] text-[#F5C770] hover:bg-[#9F6612]"
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
            className={cx("bg-[#7B7B73] text-[#F0F5F7] hover:bg-[#9F9296]")}
          >
            Clear
          </ChatbotButton>
        )}
        <FontAwesomeIcon
          role="button"
          icon={isOpen ? faSquareCaretDown : faSquareCaretUp}
          onClick={
            isOpen
              ? close
              : function () {
                  open();
                  inputRef.current?.focus();
                }
          }
          className="text-color-secondary hover:text-color-primary h-8 w-8 cursor-pointer transition-colors"
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
        "typography-label-small !font-weight-bold h-[29px] rounded p-0 px-2 transition-colors md:px-4",
        className,
      )}
    >
      {children}
    </button>
  );
}
