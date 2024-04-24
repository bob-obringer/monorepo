"use client";

import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import { Button, cx, Text } from "@bob-obringer/design-system";
import NextLink from "next/link";
import { FormEvent, ReactNode, useRef } from "react";
import {
  faUser,
  faHistory,
  faAddressCard,
  faCubesStacked,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatBody } from "@/app/(app-layout)/chat-body";
import { useSelectedLayoutSegments } from "next/navigation";

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
        isOpen ? "z-20 h-svh bg-[#0D141F]" : "h-28 md:h-40",
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
          isOpen ? "bg-[#0D141F]" : "h-28 md:h-40",
          "fixed bottom-0 w-full px-5",
        )}
      >
        <Footer />
      </div>
    </div>
  );
}

function AiSection() {
  const { close } = useBobObringerAi();

  return (
    <div className="mx-auto w-full max-w-screen-md flex-1 overflow-hidden text-balance">
      <div className="fixed left-0 right-0 top-0 z-10 flex h-12 items-center justify-center bg-[#0D141F] bg-opacity-50 backdrop-blur-md">
        <Button style="text" onPress={close}>
          Close Chat
        </Button>
      </div>
      <div className="pb-28 pt-12 md:px-5 md:pb-40">
        <ChatBody />
      </div>
    </div>
  );
}

function Footer() {
  const {
    chat: { input, handleInputChange, handleSubmit },
  } = useBobObringerAi();
  const segments = useSelectedLayoutSegments();
  const segment = segments[0] ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    handleSubmit(event);
    inputRef.current?.blur();
  }

  return (
    <footer className="mx-auto flex h-28 w-full max-w-screen-sm flex-col justify-around py-3 md:h-40">
      <form onSubmit={handleFormSubmit} className="w-full">
        <input
          ref={inputRef}
          className="bg-color-secondary w-full rounded border border-[#333333] p-2 shadow-xl focus:outline-1"
          value={input}
          placeholder="Chat with bob.obringer.net AI assistant"
          onChange={handleInputChange}
        />
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
        <FontAwesomeIcon icon={icon} className="h-6" />
        <div className="hidden md:inline-block">{children}</div>
      </NextLink>
    </Text>
  );
}
