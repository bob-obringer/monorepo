"use client";

import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import { ReactNode, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser, faWarning } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@bob-obringer/design-system";

export function ChatBody() {
  const {
    chat: { messages },
  } = useBobObringerAi();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <Info />
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? (
            <UserMessage>{m.content}</UserMessage>
          ) : (
            <AIMessage>{m.content}</AIMessage>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} className="pb-6" />
    </>
  );
}

function AIMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/*<div className="text-color-tertiary hidden w-12 justify-center pt-5 md:flex">*/}
      {/*  <FontAwesomeIcon icon={faRobot} size="lg" />*/}
      {/*</div>*/}
      <div className="flex flex-1 flex-col gap-3 bg-[#ffffff] bg-opacity-5 p-5">
        <div className="font-weight-medium relative text-sm">
          <FontAwesomeIcon
            icon={faRobot}
            size="lg"
            className="text-color-tertiary absolute right-0"
          />
          <div className="text-color-tertiary">bob.obringer.net Assistant</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/*<div className="text-color-tertiary hidden w-12 justify-center pt-5 md:flex">*/}
      {/*  <FontAwesomeIcon icon={faUser} size="lg" />*/}
      {/*</div>*/}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="font-weight-medium text-color-secondary relative text-sm">
          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            className="text-color-tertiary absolute right-0.5"
          />
          <Text color="tertiary">You</Text>
        </div>
        {children}
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="flex">
      <div className="flex flex-1 flex-col gap-3 bg-[#7e451e] bg-opacity-20 p-5">
        <div className="font-weight-medium relative text-sm">
          <FontAwesomeIcon
            icon={faWarning}
            size="lg"
            className="text-color-warning absolute right-0"
          />
          <div className="text-color-warning">
            bob.obringer.net Assistant Beta
          </div>
        </div>
        {`Hi, I'm bob.obringer.net's AI assistant and I'm still under development.
        Bob needs to do much more tuning and help make me smarter, but as of today, you
        can already ask me questions about Bob's bio and experience. Soon, I will also
        be able to tell you more about about his tech stack, additional projets, articles
        and more. Stay tuned!`}
      </div>
    </div>
  );
}
