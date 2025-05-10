import {
  faRobot,
  faUserVisor,
} from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";
import { ReactNode } from "react";
import { ChatbotUIMessage } from "@/features/ai-chatbot/types";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatbotMessageStatusIndicator } from "@/features/ai-chatbot/components/chatbot-message-status-indicator";
import { cn } from "@/helpers/cn";
import { Div } from "@bob-obringer/design-system";

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
    className: "bg-bg-highlight/60 border-foreground/10 border rounded-lg",
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
    <div className={cn(className, "relative overflow-x-hidden")}>
      <div className={"flex flex-col gap-5 p-5"}>
        <MessageTitle isLastMessage={isLastMessage} message={message} />
        <div
          className={cn(
            message.status === "cancelled" && "text-warning opacity-50",
            message.status === "error" && "text-destructive",
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
    <Div
      variant="title"
      className={cn(
        titleClassName,
        "flex items-center justify-between space-x-3",
      )}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <Div className="flex-1">{roleName}</Div>
      {isLastMessage && <ChatbotMessageStatusIndicator message={message} />}
    </Div>
  );
}
