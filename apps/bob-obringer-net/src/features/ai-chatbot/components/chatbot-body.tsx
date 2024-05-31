"use client";

import "@/features/ai-chatbot/components/chatbot.css";
import { ReactNode, RefObject, useEffect, useRef } from "react";

import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import {
  faInfoCircle,
  faRobot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ChatbotUIMessage } from "@/features/ai-chatbot/types";
import { cx, Text } from "@bob-obringer/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatbotMessageStatusIndicator } from "@/features/ai-chatbot/components/chatbot-message-status-indicator";

export function ChatbotBody({
  scrollerRef,
}: {
  scrollerRef: RefObject<HTMLDivElement>;
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
    <div className="space-y-4" ref={resizeRef}>
      <Text
        as="div"
        className={"px-5 text-center"}
        color="secondary"
        variant="body-small"
      >
        {`I'm an AI ChatBot with an occasional wild streak.
        While I'm powered by facts, I sometimes sprinkle in a dash of
        imagination. Double-check anything important, and let's enjoy the
        conversation!`}
      </Text>
      <hr className="border-[#ffffff22]" />
      {messages.map((m) => {
        return (
          <div key={m.id} className="whitespace-pre-wrap">
            <Message message={m} isLastMessage={m.id === lastMessage?.id}>
              {m.ui}
            </Message>
          </div>
        );
      })}
      <div ref={messagesEndRef} className="pb-6" />
    </div>
  );
}

const messageRoleInfo = {
  user: {
    icon: faUser,
    roleName: "You",
    className: "",
    titleClassName: "text-color-secondary",
  },
  assistant: {
    icon: faRobot,
    roleName: "Bob's ChatBot",
    className: "bg-opacity-5 bg-[#ffffff]",
    titleClassName: "text-color-secondary",
  },
  _info: {
    icon: faInfoCircle,
    roleName: "About obringer.net Assistant",
    className: "bg-[#7e451e] bg-opacity-20",
    titleClassName: "text-color-warning",
  },
};

function Message({
  children,
  message,
  isLastMessage = false,
}: {
  children: ReactNode;
  message: ChatbotUIMessage;
  isLastMessage?: boolean;
}) {
  const { chatbotStatus } = useChatbot();
  const { className } = messageRoleInfo[message.role];
  const isActive = isLastMessage && chatbotStatus === "active";

  return (
    <div className={cx(className, "relative overflow-x-hidden")}>
      <div className={"flex flex-col gap-5 p-5"}>
        <MessageTitle isLastMessage={isLastMessage} message={message} />
        <div
          className={cx(
            message.status === "cancelled" && "text-color-warning opacity-50",
            message.status === "error" && "text-color-negative",
          )}
        >
          {children}
        </div>
      </div>
      {isActive && (
        <div className="loading-color-bar-wrapper">
          <div className="loading-color-bar" />
        </div>
      )}
    </div>
  );
}

function MessageTitle({
  message,
  isLastMessage,
}: {
  message: ChatbotUIMessage;
  isLastMessage: boolean;
}) {
  const { icon, roleName, titleClassName } = messageRoleInfo[message.role];

  return (
    <div
      className={cx(
        titleClassName,
        "flex items-center justify-between space-x-3 text-sm",
      )}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <div className="typography-title-medium flex-1">{roleName}</div>
      {isLastMessage && <ChatbotMessageStatusIndicator message={message} />}
    </div>
  );
}
