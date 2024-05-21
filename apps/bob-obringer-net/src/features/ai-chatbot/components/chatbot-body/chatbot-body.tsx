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
  const { messages, ragStatus, streamEventCount } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    scrollToBottom();
  }, [streamEventCount, ragStatus, messages.length]);

  useEffect(() => {
    let interval: number = 0;
    if (ragStatus !== "idle") {
      interval = setInterval(() => {
        scrollToBottom();
      }, 10) as unknown as number;
      return () => clearInterval(interval);
    } else if (interval) {
      clearInterval(interval);
    }
  });

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
  const { className } = messageRoleInfo[role];
  const isActiveMessage = isLastMessage && isLoading;

  return (
    <div className={cx(className, "relative overflow-x-hidden")}>
      <div className="flex flex-col gap-5 p-5">
        <MessageTitle isLastMessage={isLastMessage} messageRole={role} />
        {children}
      </div>
      {isActiveMessage && (
        <div className="loading-color-bar-wrapper">
          <div className="loading-color-bar" />
        </div>
      )}
    </div>
  );
}

function MessageTitle({
  messageRole,
  isLastMessage,
}: {
  messageRole: MessageRole;
  isLastMessage: boolean;
}) {
  const { icon, roleName, titleClassName } = messageRoleInfo[messageRole];

  return (
    <div
      className={cx(
        titleClassName,
        "flex items-center justify-between space-x-3 text-sm",
      )}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <div className="typography-title-medium flex-1">{roleName}</div>
      {isLastMessage && <MessageState />}
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
        "flex flex-col items-center space-y-1 transition-opacity duration-500 md:flex-row md:justify-center md:space-x-2 md:space-y-0",
        hide ? "opacity-0" : "opacity-75",
      )}
    >
      <Text
        as="div"
        variant="label-mono-small"
        className={cx(
          "flex items-center gap-2 transition-colors md:flex-row-reverse",
          "text-color-tertiary",
          ragStatus === "retrieving" && "text-color-primary",
          (ragStatus === "generating" || ragStatus === "done") &&
            "text-[#66CC66]",
        )}
      >
        <div>Retrieving</div>
        <FontAwesomeIcon
          icon={ragStatus === "retrieving" ? faSpinner : faCheck}
          size="lg"
          spin={ragStatus === "retrieving"}
          className="w-4"
        />
      </Text>
      <Text
        as="div"
        variant="label-mono-small"
        className={cx(
          "flex items-center gap-2 transition-colors md:flex-row-reverse",
          "text-color-tertiary",
          ragStatus === "generating" && "text-color-primary",
          ragStatus === "done" && "text-[#66CC66]",
        )}
      >
        <div>Generating</div>
        <FontAwesomeIcon
          icon={
            ["done", "idle"].includes(ragStatus)
              ? faCheck
              : ragStatus === "generating"
                ? faSpinner
                : faPauseCircle
          }
          size="lg"
          spin={ragStatus === "generating"}
          className="w-4"
        />
      </Text>
    </div>
  );
}
