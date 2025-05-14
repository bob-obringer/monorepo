import {
  faRobot,
  faUserVisor,
} from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/helpers/cn";
import { Div } from "@bob-obringer/design-system";
import { UIMessage } from "ai";
import { ChatStatus } from "@/features/ai-chatbot/context/chat-context";
import { AnimatedMarkdown } from "./animated-markdown";
import { ContactCard } from "@/components/contact-card";
import { ContactInfoWithAsset } from "@/integrations/sanity-io/queries/contact-info";
import { ResumeCard, ResumeLinkCard } from "@/components/resume-card";

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
  message,
  status,
  isLastMessage,
}: {
  message: UIMessage;
  status: ChatStatus;
  isLastMessage: boolean;
}) {
  if (message.role === "system" || message.role === "data") return null;

  const { className } = messageRoleInfo[message.role];
  const isActive =
    isLastMessage && (status === "streaming" || status === "submitted");

  return (
    <div className={cn(className, "relative overflow-x-hidden")}>
      <div className={"flex flex-col gap-5 p-5"}>
        <MessageTitle message={message} />
        <div className={cn(status === "error" && "text-destructive")}>
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <AnimatedMarkdown
                  key={message.id + "_" + index}
                  id={message.id}
                  content={part.text}
                />
              );
            }
            if (part.type === "tool-invocation") {
              const { toolName, state } = part.toolInvocation;
              if (toolName === "contact") {
                if (state !== "result") return null;
                return (
                  <ContactToolResult
                    key={index}
                    contactInfo={part.toolInvocation.result}
                  />
                );
              }
              if (toolName === "resume") {
                if (state !== "result") return null;
                return <ResumeToolResult key={index} />;
              }
            }
            return null;
          })}
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

function MessageTitle({ message }: { message: UIMessage }) {
  if (message.role === "data" || message.role === "system") return null;

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
    </Div>
  );
}

function ContactToolResult({
  contactInfo,
}: {
  contactInfo: ContactInfoWithAsset | Array<ContactInfoWithAsset>;
}) {
  if (Array.isArray(contactInfo)) {
    return (
      <div
        className="grid h-full auto-rows-fr gap-2 sm:auto-rows-min sm:grid-cols-2"
        style={{ gridAutoFlow: "row dense" }}
      >
        {contactInfo.map((contact) => (
          <ContactCard key={contact._id} contactInfo={contact} />
        ))}
      </div>
    );
  }

  return <ContactCard contactInfo={contactInfo} />;
}

function ResumeToolResult() {
  return (
    <div
      className="grid h-full auto-rows-fr gap-2 sm:auto-rows-min sm:grid-cols-2"
      style={{ gridAutoFlow: "row dense" }}
    >
      <ResumeCard />
      <ResumeLinkCard />
    </div>
  );
}
