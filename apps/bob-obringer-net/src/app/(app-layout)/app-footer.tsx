"use client";

import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import { cx, Text } from "@bob-obringer/design-system";
import NextLink from "next/link";
import { FormEvent, ReactNode, useRef } from "react";
import {
  faUser,
  faHistory,
  faAddressCard,
  faCubesStacked,
  IconDefinition,
  faSquareCaretDown,
  faSquareCaretUp,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelectedLayoutSegments } from "next/navigation";
import { ChatBody } from "@/features/ai/components/chat-body/chat-body";
import { useUiContext } from "@/features/ui/ui-context";

const menuItems = [
  { href: "", icon: faUser, text: "Bob" },
  { href: "experience", icon: faHistory, text: "Experience" },
  { href: "stack", icon: faCubesStacked, text: "Stack" },
  { href: "contact", icon: faAddressCard, text: "Contact" },
];

export function AppFooter({ className }: { className?: string }) {
  const { isOpen } = useBobObringerAi();

  return (
    <div
      className={cx(
        className,
        isOpen ? "z-20 h-svh bg-[#0D141F]" : "h-32 md:h-40",
        "fixed bottom-0 flex w-full flex-col items-center overflow-hidden",
        "bg-opacity-40 backdrop-blur-md transition-all duration-500 ease-in-out",
      )}
    >
      <div
        className={cx(
          !isOpen && "hidden",
          "w-full flex-1 overflow-scroll bg-[#0D141F]",
        )}
      >
        <AiSection />
      </div>
      <div
        className={cx(
          isOpen
            ? "bg-[#0D141F] bg-opacity-40 backdrop-blur-lg"
            : "h-28 md:h-40",
          "fixed bottom-0 w-full px-5",
        )}
      >
        <Footer />
      </div>
    </div>
  );
}

function AiSection() {
  return (
    <div className="mx-auto w-full max-w-screen-md flex-1 overflow-hidden text-balance px-2 pb-28 pt-5 md:px-5 md:pb-40">
      <ChatBody
        info={`Hi, I'm obringer.net's AI assistant.  I'm still under development,
        and sometimes I have crazy halucinations, but as of today, you
        can ask me questions about Bob's bio and experience. Soon, I will also
        be able to tell you more about about his tech stack, additional projets, articles
        and more. Stay tuned!`}
      />
    </div>
  );
}

function Footer() {
  const {
    chat: { input, handleInputChange, handleSubmit, setMessages },
    isOpen,
    close,
    open,
  } = useBobObringerAi();
  const segments = useSelectedLayoutSegments();
  const segment = segments[0] ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const { viewportWidth } = useUiContext();

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    handleSubmit(event);
    if ((viewportWidth ?? 0) < 768) inputRef.current?.blur();
  }

  return (
    <footer
      className={cx(
        "mx-auto flex h-28 w-full max-w-screen-sm flex-col justify-around py-3 md:h-40",
      )}
    >
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="bg-color-secondary flex w-full items-center space-x-3 rounded border border-[#333333] p-2 shadow-xl focus:outline-1 md:space-x-2">
          <input
            ref={inputRef}
            className="bg-color-transparent flex-1 p-0 pl-2 shadow-xl focus:outline-0"
            value={input}
            placeholder="Chat with bob.obringer.net's AI assistant"
            onChange={handleInputChange}
          />
          {input && (
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
                setMessages([]);
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
      <Nav activeSegment={segment} />
    </footer>
  );
}

function Nav({ activeSegment }: { activeSegment: string }) {
  return (
    <nav className="flex w-full select-none justify-center">
      <ul className="flex w-full items-center justify-around">
        {menuItems.map(({ href, icon, text }) => (
          <MenuItem
            key={href}
            href={href}
            icon={icon}
            isActive={activeSegment === href}
          >
            {text}
          </MenuItem>
        ))}
      </ul>
    </nav>
  );
}

function MenuItem({
  href,
  children,
  icon,
  isActive,
}: {
  href: string;
  children: ReactNode;
  icon: IconDefinition;
  isActive: boolean;
}) {
  const { close } = useBobObringerAi();

  return (
    <Text variant="label-small">
      <NextLink
        href={`/${href}`}
        onClick={close}
        className={cx(
          isActive
            ? "text-color-primary"
            : "text-color-link hover:text-color-link-hover",
          "typography-label-small flex flex-col items-center space-y-2 transition-colors duration-300 ease-in-out",
        )}
      >
        <FontAwesomeIcon icon={icon} className="md: h-6 h-8" />
        <div className="hidden md:inline-block">{children}</div>
      </NextLink>
    </Text>
  );
}
