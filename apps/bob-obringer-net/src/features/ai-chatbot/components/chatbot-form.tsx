"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretDown,
  faSquareCaretUp,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent } from "react";
import { useChatbot } from "@/features/ai-chatbot/client/chatbot-inner-context";

export function ChatbotForm() {
  const {
    isOpen,
    close,
    open,
    inputValue,
    setInputValue,
    onFormSubmit,
    inputRef,
  } = useChatbot();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.currentTarget.value);
  }

  return (
    <form onSubmit={onFormSubmit} className="w-full">
      <div className="bg-color-secondary flex w-full items-center space-x-3 rounded border border-[#333333] p-2 shadow-xl focus:outline-1 md:space-x-2">
        <input
          ref={inputRef}
          className="bg-color-transparent flex-1 p-0 pl-2 shadow-xl focus:outline-0"
          value={inputValue}
          placeholder="obringer.net Assistant"
          onChange={handleInputChange}
        />
        {inputValue && (
          <button
            type="submit"
            className="typography-label-small !font-weight-bold h-[29px] rounded bg-[#1B537B] p-0 px-4 text-[#75C7F0] transition-colors hover:bg-[#1F6692]"
          >
            Ask
          </button>
        )}
        {isOpen && (
          <FontAwesomeIcon
            role="button"
            icon={faSquarePlus}
            onClick={() => {
              // setMessages([]);
              inputRef.current?.focus();
            }}
            className="text-color-secondary hover:text-color-primary h-8 w-8 cursor-pointer transition-colors"
          />
        )}
        <FontAwesomeIcon
          role="button"
          icon={isOpen ? faSquareCaretDown : faSquareCaretUp}
          onClick={isOpen ? close : open}
          className="text-color-secondary hover:text-color-primary h-8 w-8 cursor-pointer transition-colors"
        />
      </div>
    </form>
  );
}
