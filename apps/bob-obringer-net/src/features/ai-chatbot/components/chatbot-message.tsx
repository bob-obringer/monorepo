import {
  faInfoCircle,
  faRobot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { ChatbotUIMessage } from "@/features/ai-chatbot/types";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { cx } from "@bob-obringer/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatbotMessageStatusIndicator } from "@/features/ai-chatbot/components/chatbot-message-status-indicator";

const messageRoleInfo = {
  user: {
    icon: faUser,
    roleName: "You",
    className: "",
    titleClassName: "text-color-secondary",
  },
  assistant: {
    icon: faRobot,
    roleName: "Bob's Chatbot",
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
        "flex items-center justify-between space-x-3 text-sm",
      )}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <div className="typography-title-medium flex-1">{roleName}</div>
      {isLastMessage && <ChatbotMessageStatusIndicator message={message} />}
    </div>
  );
}
