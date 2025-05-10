import { ReactNode } from "react";
import { Span } from "@bob-obringer/design-system";
import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelectedLayoutSegments } from "next/navigation";
// import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import {
  faCode,
  faBookUser,
  faHomeUser,
  faDriversLicense,
} from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { cn } from "@/helpers/cn";

const menuItems = [
  { href: "", icon: faHomeUser, text: "Home" },
  { href: "experience", icon: faBookUser, text: "Experience" },
  { href: "projects", icon: faCode, text: "Projects" },
  { href: "contact", icon: faDriversLicense, text: "Contact" },
];

export function FooterNav() {
  const segments = useSelectedLayoutSegments();
  const selectedSegment = segments[0] ?? "";

  return (
    <nav className="flex w-full select-none justify-center">
      <ul className="flex w-full items-center justify-around">
        {menuItems.map(({ href, icon, text }) => (
          <MenuItem
            key={href}
            href={href}
            icon={icon}
            isActive={selectedSegment === href}
          >
            {text}
          </MenuItem>
        ))}
      </ul>
    </nav>
  );
}

function MenuItem({
  href,
  children,
  icon,
  isActive,
}: {
  href: string;
  children: ReactNode;
  icon: IconDefinition;
  isActive: boolean;
}) {
  // const { close } = useChatbot();
  const close = () => {};

  return (
    <Span
      variant="label"
      asChild
      className={cn(
        isActive
          ? "bg-bg-highlight shadow-lg transition-colors"
          : "hover:text-foreground text-text-subtle",
        "flex min-w-20 flex-col items-center space-y-2 rounded p-2 transition-colors duration-300 ease-in-out",
      )}
    >
      <NextLink href={`/${href}`} onClick={close}>
        <FontAwesomeIcon
          // @ts-expect-error todo: fixme
          icon={icon}
          style={{ height: "24px", width: "24px" }}
        />
        <div className="hidden md:inline-block">{children}</div>
      </NextLink>
    </Span>
  );
}
