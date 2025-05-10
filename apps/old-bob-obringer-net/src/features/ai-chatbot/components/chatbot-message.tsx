import {
  faRobot,
  faUserVisor,
} from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";
import { ReactNode } from "react";
import { ChatbotUIMessage } from "@/features/ai-chatbot/types";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { cx } from "@bob-obringer/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatbotMessageStatusIndicator } from "@/features/ai-chatbot/components/chatbot-message-status-indicator";

const messageRoleInfo = {
  user: {
    icon: faUserVisor,
    roleName: "You",
    className: "",
    titleClassName: "text-color-tertiary",
  },
  assistant: {
    icon: faRobot,
    roleName: "Bob's Chatbot",
    className:
      "bg-color-contrast bg-opacity-5 border-color-secondary border rounded-lg",
    titleClassName: "text-color-tertiary",
  },
};

export function ChatbotMessage({
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
        "flex items-center justify-between space-x-3",
      )}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <div className="typography-title-small flex-1">{roleName}</div>
      {isLastMessage && <ChatbotMessageStatusIndicator message={message} />}
    </div>
  );
}
