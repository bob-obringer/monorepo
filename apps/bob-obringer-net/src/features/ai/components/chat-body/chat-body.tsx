import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import { ReactNode, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faRobot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { cx } from "@bob-obringer/design-system";
import "@/features/ai/components/chat-body/loading-color-bar.css";

export function ChatBody({ info }: { info?: string }) {
  const {
    chat: { messages, isLoading },
  } = useBobObringerAi();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="space-y-4">
      {info && <Message role="_info">{info}</Message>}
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? (
            <Message role="user">{m.content}</Message>
          ) : (
            <Message
              role="ai"
              isLastMessage={m.id === lastMessage?.id}
              isLoading={isLoading}
            >
              {m.content}
            </Message>
          )}
        </div>
      ))}
      {isLoading && lastMessage.role === "user" && (
        <Message role="ai" isLastMessage={true} isLoading={true}>
          {""}
        </Message>
      )}
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
  ai: {
    icon: faRobot,
    roleName: "obringer.net Assistant",
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
  role,
  isLastMessage = false,
  isLoading = false,
}: {
  children: ReactNode;
  role: "user" | "ai" | "_info";
  isLastMessage?: boolean;
  isLoading?: boolean;
}) {
  const { icon, roleName, className, titleClassName } = messageRoleInfo[role];
  const isActiveMessage = isLastMessage && isLoading;

  return (
    <div className={cx(className, "relative flex-col gap-3 overflow-x-hidden")}>
      <div
        className={cx(
          titleClassName,
          "font-weight-medium relative flex items-center space-x-3 p-5 text-sm",
        )}
      >
        <FontAwesomeIcon icon={icon} size="lg" />
        <span className="typography-title-medium !font-weight-medium">
          {roleName}
        </span>
      </div>
      <div className="p-5 pt-0">{children}</div>
      {isActiveMessage && (
        <div className="loading-color-bar-wrapper">
          <div className="loading-color-bar" />
        </div>
      )}
    </div>
  );
}
