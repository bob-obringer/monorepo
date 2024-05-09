"use client";

import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import { cx, Text } from "@bob-obringer/design-system";
import NextLink from "next/link";
import { FormEvent, ReactNode, useEffect, useRef } from "react";
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
import { useUiState } from "@/features/ui/ui-state-context";

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
        "fixed bottom-0 flex w-full flex-col items-center overflow-hidden",
        "bg-opacity-50 backdrop-blur-2xl transition-all duration-500 ease-in-out",
        isOpen
          ? "z-20 h-svh bg-[#0D141F] bg-opacity-50 backdrop-blur-xl"
          : "border-color-tertiary h-32 border-t md:h-40",
      )}
    >
      <div className={cx(!isOpen && "hidden", "w-full flex-1 overflow-scroll")}>
        <AiSection />
      </div>
      <div
        className={cx(
          isOpen ? "" : "h-32 md:h-40",
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
  const { viewportWidth } = useUiState();

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    handleSubmit(event);
    if ((viewportWidth ?? 0) < 768) inputRef.current?.blur();
  }

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
    <footer
      className={cx(
        "mx-auto flex h-32 w-full max-w-screen-sm flex-col justify-between py-5 md:h-40",
      )}
    >
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="bg-color-secondary flex w-full items-center space-x-3 rounded border border-[#333333] p-2 shadow-xl focus:outline-1 md:space-x-2">
          <input
            ref={inputRef}
            className="bg-color-transparent flex-1 p-0 pl-2 shadow-xl focus:outline-0"
            value={input}
            placeholder="obringer.net Assistant"
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
    <Text
      variant="label-small"
      asChild
      className={cx(
        isActive
          ? "bg-[#112840] outline outline-1 -outline-offset-1 outline-[#154467] transition-colors"
          : "text-color-secondary hover:text-color-primary",
        "typography-label-small flex min-w-20 flex-col items-center space-y-2 rounded p-2 transition-colors duration-300 ease-in-out",
      )}
    >
      <NextLink href={`/${href}`} onClick={close}>
        <FontAwesomeIcon icon={icon} className="h-8 md:h-6" />
        <div className="hidden md:inline-block">{children}</div>
      </NextLink>
    </Text>
  );
}
