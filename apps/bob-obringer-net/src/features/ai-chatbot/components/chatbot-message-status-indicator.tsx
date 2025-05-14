import {
  faClose,
  faCheck,
  faPauseCircle,
  faSpinner,
} from "@awesome.me/kit-8a94ae437c/icons/sharp/solid";

import { Div } from "@bob-obringer/design-system";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/helpers/cn";
import { ChatStatus } from "@/features/ai-chatbot/context/chat-context";

export function ChatbotMessageStatusIndicator({
  status,
}: {
  status: ChatStatus;
}) {
  // const isIdle = status === "idle";

  // if (status === "cancelled") {
  //   return (
  //     <MessageStateWrapper isIdle={isIdle}>
  //       <MessageStateItem isCancelling>Cancelling</MessageStateItem>
  //     </MessageStateWrapper>
  //   );
  // }

  if (status === "error") {
    return (
      <MessageStateWrapper isIdle={true}>
        <MessageStateItem isDone>Error</MessageStateItem>
      </MessageStateWrapper>
    );
  }

  const isSubmitted = status === "submitted";
  const isStreaming = status === "streaming";

  return (
    <MessageStateWrapper isIdle={status === "ready"}>
      <MessageStateItem isActive={isSubmitted}>Submitting</MessageStateItem>
      <MessageStateItem isActive={isStreaming}>Streaming</MessageStateItem>
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
      className={cn(
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
  isDone,
  isActive,
  isCancelling,
}: {
  children: ReactNode;
  isDone?: boolean;
  isActive?: boolean;
  isCancelling?: boolean;
}) {
  return (
    <Div
      variant="label"
      className={cn(
        "flex items-center gap-2 transition-colors md:flex-row-reverse",
        "text-color-tertiary",
        isCancelling && "text-color-warning",
        isActive && "text-color-primary",
        isDone && "text-color-positive",
      )}
    >
      {children}
      <FontAwesomeIcon
        icon={
          isCancelling
            ? faClose
            : isActive
              ? faSpinner
              : isDone
                ? faCheck
                : faPauseCircle
        }
        size="lg"
        spin={isActive}
        className="w-4"
      />
    </Div>
  );
}
