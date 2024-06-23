import { ReactNode } from "react";
import { cx, Text } from "@bob-obringer/components";
import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelectedLayoutSegments } from "next/navigation";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import {
  faCode,
  faBookUser,
  faHomeUser,
  faDriversLicense,
} from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

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
  const { close } = useChatbot();

  return (
    <Text
      variant="label-small"
      asChild
      className={cx(
        isActive
          ? "bg-color-tertiary shadow-lg transition-colors"
          : "hover:text-color-secondary text-color-tertiary",
        "typography-label-small flex min-w-20 flex-col items-center space-y-2 rounded p-2 transition-colors duration-300 ease-in-out",
      )}
    >
      <NextLink href={`/${href}`} onClick={close}>
        <FontAwesomeIcon icon={icon} className="h-8 md:h-6" />
        <div className="hidden md:inline-block">{children}</div>
      </NextLink>
    </Text>
  );
}
