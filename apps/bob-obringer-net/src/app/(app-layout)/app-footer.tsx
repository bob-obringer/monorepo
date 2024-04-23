"use client";

import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import { Button, cx, Text } from "@bob-obringer/design-system";
import NextLink from "next/link";
import { ReactNode, useEffect, useRef } from "react";
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

export function AppFooter({ className }: { className?: string }) {
  const {
    chat: { messages },
    isFullScreen,
    close,
  } = useBobObringerAi();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(scrollToBottom, [messages, isFullScreen]);

  return (
    <div
      className={cx(
        className,
        isFullScreen ? "z-20 h-svh bg-[#0D141F]" : "h-28 md:h-40",
        "fixed bottom-0 flex w-full flex-col items-center overflow-hidden transition-all duration-500 ease-in-out",
      )}
    >
      <div
        className={cx(
          !isFullScreen && "hidden",
          "w-full flex-1 overflow-scroll",
        )}
      >
        <div className="mx-auto w-full max-w-screen-md flex-1 overflow-hidden text-balance">
          <div className="bg fixed left-0 right-0 top-0 z-10 flex h-12 items-center justify-center bg-opacity-50 backdrop-blur-md">
            <Button style="text" onPress={close}>
              Close Chat
            </Button>
          </div>
          <div className="pb-28 pt-12 md:px-5 md:pb-40">
            <ChatBody />
          </div>
        </div>
      </div>
      <FooterFooter />
    </div>
  );
}

function FooterFooter() {
  const {
    chat: { input, handleInputChange, handleSubmit },
    isFullScreen,
  } = useBobObringerAi();
  const segments = useSelectedLayoutSegments();
  const segment = segments[0] ?? "";

  return (
    <footer
      className={cx(
        "fixed bottom-0 w-full bg-opacity-40 px-5 backdrop-blur-md",
        isFullScreen ? "bg" : "bg-color-primary",
      )}
    >
      <div className="mx-auto flex h-28 w-full max-w-screen-sm flex-col justify-around py-3 md:h-40">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            className="bg-color-secondary w-full rounded border border-[#333333] p-2 shadow-xl focus:outline-1"
            value={input}
            placeholder="Chat with bob.obringer.net AI assistant"
            onChange={handleInputChange}
          />
        </form>
        <Nav activeSegment={segment} />
      </div>
    </footer>
  );
}

function Nav({ activeSegment }: { activeSegment: string }) {
  const links = [
    { href: "", icon: faUser, text: "Bob" },
    { href: "experience", icon: faHistory, text: "Experience" },
    { href: "stack", icon: faCubesStacked, text: "Stack" },
    { href: "contact", icon: faAddressCard, text: "Contact" },
  ];

  return (
    <nav className="flex w-full justify-center">
      <ul className="flex w-full items-center justify-around">
        {links.map(({ href, icon, text }) => (
          <Text key={href} as="li" variant="label-small">
            <Link href={href} icon={icon} isActive={activeSegment === href}>
              {text}
            </Link>
          </Text>
        ))}
      </ul>
    </nav>
  );
}

function Link({
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
  );
}
