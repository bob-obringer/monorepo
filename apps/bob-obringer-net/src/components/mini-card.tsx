import { Text } from "@bob-obringer/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import {
  NextJsSanityImage,
  SanityImageField,
} from "@bob-obringer/nextjs-sanity-io-image";

interface CardProps {
  href: string;
  iconName?: string;
  label: string;
  text: string;
  logo?: SanityImageField;
}

export function MiniCard({ href, iconName, logo, label, text }: CardProps) {
  return (
    <a
      href={href}
      target="_blank"
      className="flex w-full max-w-72 items-center gap-4 rounded border border-[#ffffff11] bg-[#ffffff11] px-4 py-2"
    >
      {iconName && (
        // @ts-expect-error can't index icons like this
        <FontAwesomeIcon size="2x" width="2rem" icon={icons[`fa${iconName}`]} />
      )}
      {logo && (
        <div className="overflow-hiden h-8 w-8">
          <NextJsSanityImage
            width={64}
            height={64}
            alt={label}
            sanityImage={logo}
          />
        </div>
      )}
      <div>
        <Text as="div" variant="label-small" color="secondary">
          {label}
        </Text>
        <Text as="div" variant="body-large">
          {text}
        </Text>
      </div>
    </a>
  );
}
