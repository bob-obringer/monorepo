import {
  faRobot,
  faUserVisor,
} from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";
import { faSpinner } from "@awesome.me/kit-8a94ae437c/icons/sharp/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/helpers/cn";
import { Div } from "@bob-obringer/design-system";
import { format } from "date-fns";
import { Markdown } from "@/features/markdown/markdown";

// Define the message role information similar to the original component
const messageRoleInfo = {
  user: {
    icon: faUserVisor,
    roleName: "User",
    className: "",
    titleClassName: "text-muted-foreground",
  },
  assistant: {
    icon: faRobot,
    roleName: "Bob's Chatbot",
    className: "bg-accent/40 border-border border rounded-lg",
    titleClassName: "text-muted-foreground",
  },
  system: {
    icon: faSpinner,
    roleName: "System",
    className: "border-border border rounded-lg",
    titleClassName: "text-muted-foreground",
  },
};

// Type for Supabase message
type SupabaseMessage = {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

export function ChatMessage({ message }: { message: SupabaseMessage }) {
  const roleInfo = messageRoleInfo[message.role];

  return (
    <div
      className={cn(
        roleInfo.className,
        "relative w-full overflow-hidden text-left",
      )}
    >
      <div className="flex flex-col gap-3 p-4">
        <MessageTitle message={message} />
        <div className="text-left">
          <Markdown markdown={message.content} />
        </div>
      </div>
    </div>
  );
}

function MessageTitle({ message }: { message: SupabaseMessage }) {
  const { icon, roleName, titleClassName } = messageRoleInfo[message.role];

  return (
    <Div
      variant="title"
      className={cn(
        titleClassName,
        "flex items-center justify-between space-x-3 text-sm",
      )}
    >
      <FontAwesomeIcon icon={icon} size="sm" className="h-4 w-4" />
      <Div className="flex-1">{roleName}</Div>
      <Div variant="caption" color="subtle" className="text-xs">
        {format(new Date(message.timestamp), "p")}
      </Div>
    </Div>
  );
}
