import "@/features/ai-chatbot/components/chatbot-body/loading-color-bar.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  faInfoCircle,
  faRobot,
  faUser,
  faCheck,
  faSpinner,
  faPauseCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cx, Text } from "@bob-obringer/design-system";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";

export function ChatbotBody() {
  const { messages, isLoading } = useChatbot();

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
      {/*{info && <Message role="_info">{info}</Message>}*/}
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
  const {
    isBioLoaded,
    isInstructionsLoaded,
    isSkillsLoaded,
    isJobsLoaded,
    isLoading,
  } = useChatbot();

  const [hide, setHide] = useState(false);

  const isRetrieved =
    isBioLoaded && isInstructionsLoaded && isSkillsLoaded && isJobsLoaded;
  const isGenerating = isRetrieved && isLoading;
  const isDone = isRetrieved && !isLoading;

  useEffect(() => {
    if (isDone) {
      const timeout = setTimeout(() => {
        setHide(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isDone]);

  return (
    <div
      className={cx(
        "flex items-center space-x-0.5 rounded-lg bg-[#004400] p-px transition-opacity duration-500",
        hide ? "opacity-0" : "opacity-100",
      )}
    >
      <Text
        as="div"
        variant="label-mono-small"
        className={cx(
          "text-color-primary flex items-center space-x-2 rounded-l-md px-2 py-1 transition-colors",
          isRetrieved ? "bg-[#003300]" : "bg-[#112211]",
        )}
      >
        <FontAwesomeIcon
          icon={isRetrieved ? faCheck : faSpinner}
          size="lg"
          spin={!isRetrieved}
        />
        <div>Augmenting</div>
      </Text>
      <Text
        as="div"
        variant="label-mono-small"
        className={cx(
          "text-color-primary flex items-center space-x-2 rounded-r-md px-2 py-1 transition-colors",
          isDone && "bg-[#003300]",
          isGenerating && "bg-[#112211]",
          !isRetrieved && "text-color-tertiary bg-[#222222]",
        )}
      >
        <FontAwesomeIcon
          icon={isDone ? faCheck : isGenerating ? faSpinner : faPauseCircle}
          size="lg"
          spin={isGenerating}
        />
        <div>Generating</div>
      </Text>
    </div>
  );
}
