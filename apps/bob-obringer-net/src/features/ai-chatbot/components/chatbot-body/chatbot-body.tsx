import "@/features/ai-chatbot/components/chatbot-body/loading-color-bar.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  faCheck,
  faInfoCircle,
  faPauseCircle,
  faRobot,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cx, Text } from "@bob-obringer/design-system";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { MessageRole } from "@/features/ai-chatbot";

export function ChatbotBody() {
  const { messages, ragStatus } = useChatbot();

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
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <Message
            role={m.role}
            isLastMessage={m.id === lastMessage?.id}
            isLoading={["retrieving", "generating"].includes(ragStatus)}
          >
            {m.ui}
          </Message>
        </div>
      ))}
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
  role: MessageRole;
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
          "font-weight-medium relative flex items-center justify-between space-x-3 p-5 text-sm",
        )}
      >
        <div className="space-x-2">
          <FontAwesomeIcon icon={icon} size="lg" />
          <span className="typography-title-medium !font-weight-medium">
            {roleName}
          </span>
        </div>
        {isLastMessage && <MessageState />}
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

function MessageState() {
  const { ragStatus, setRagStatus } = useChatbot();

  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (ragStatus === "done") {
      const timeout = setTimeout(() => {
        setHide(true);
        setRagStatus("idle");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [ragStatus, setRagStatus]);

  return (
    <div
      className={cx(
        "flex items-center space-x-2 rounded-lg",
        hide ? "opacity-0" : "opacity-100",
      )}
    >
      <Text
        as="div"
        variant="label-mono-small"
        className={cx(
          "flex items-center space-x-2 rounded-l-md px-2 py-1 transition-colors",
          "text-color-tertiary",
          ragStatus === "retrieving" && "text-color-primary",
          (ragStatus === "generating" || ragStatus === "done") &&
            "text-[#00AA00]",
        )}
      >
        <FontAwesomeIcon
          icon={
            ragStatus === "idle"
              ? faPauseCircle
              : ragStatus === "retrieving"
                ? faSpinner
                : faCheck
          }
          size="lg"
          spin={ragStatus === "retrieving"}
        />
        <div>Retrieving</div>
      </Text>
      <Text
        as="div"
        variant="label-mono-small"
        className={cx(
          "flex items-center space-x-2 rounded-r-md px-2 py-1 transition-colors",
          "text-color-tertiary",
          ragStatus === "generating" && "text-color-primary",
          ragStatus === "done" && "text-[#00AA00]",
        )}
      >
        <FontAwesomeIcon
          icon={
            ragStatus === "done"
              ? faCheck
              : ragStatus === "generating"
                ? faSpinner
                : faPauseCircle
          }
          size="lg"
          spin={ragStatus === "generating"}
        />
        <div>Generating</div>
      </Text>
    </div>
  );
}
