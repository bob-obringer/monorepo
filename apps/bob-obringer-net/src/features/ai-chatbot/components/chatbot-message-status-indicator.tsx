import { ChatbotUIMessage } from "@/features/ai-chatbot/types";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import {
  faCancel,
  faCheck,
  faPauseCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { cx, Text } from "@bob-obringer/design-system";
import { ReactNode } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ChatbotMessageStatusIndicator({
  message,
}: {
  message: ChatbotUIMessage;
}) {
  const { chatbotStatus } = useChatbot();
  const { status } = message;

  const isIdle = chatbotStatus === "idle";

  if (status === "cancelled") {
    return (
      <MessageStateWrapper isIdle={isIdle}>
        <MessageStateItem className="text-color-warning" icon={faCancel}>
          Cancelling
        </MessageStateItem>
      </MessageStateWrapper>
    );
  }

  const isRetrieving = status === "retrieving";
  const isRetrieved = status === "success" || status === "generating";
  const isGenerating = status === "generating";
  const isGenerated = status === "success";

  return (
    <MessageStateWrapper isIdle={isIdle}>
      <MessageStateItem
        className={cx(
          isRetrieving && "text-color-primary",
          isRetrieved && "text-[#66CC66]",
        )}
        icon={isRetrieving ? faSpinner : isRetrieved ? faCheck : faPauseCircle}
        spin={isRetrieving}
      >
        Retrieving
      </MessageStateItem>
      <MessageStateItem
        className={cx(
          isGenerating && "text-color-primary",
          isGenerated && "text-[#66CC66]",
        )}
        icon={isGenerated ? faCheck : isGenerating ? faSpinner : faPauseCircle}
        spin={isGenerating}
      >
        Generating
      </MessageStateItem>
    </MessageStateWrapper>
  );
}

function MessageStateWrapper({
  children,
  isIdle,
}: {
  isIdle: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center space-y-1 transition-opacity duration-500 md:flex-row md:justify-center md:space-x-2 md:space-y-0",
        isIdle ? "opacity-0" : "opacity-75",
      )}
    >
      {children}
    </div>
  );
}

function MessageStateItem({
  children,
  className,
  icon,
  spin,
}: {
  children: ReactNode;
  className?: string;
  icon: IconProp;
  spin?: boolean;
}) {
  return (
    <Text
      as="div"
      variant="label-mono-small"
      className={cx(
        "flex items-center gap-2 transition-colors md:flex-row-reverse",
        "text-color-tertiary",
        className,
      )}
    >
      {children}
      <FontAwesomeIcon icon={icon} size="lg" spin={spin} className="w-4" />
    </Text>
  );
}
