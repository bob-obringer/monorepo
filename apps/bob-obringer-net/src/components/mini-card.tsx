import { Text } from "@bob-obringer/components";
import {
  NextJsSanityImage,
  SanityImageField,
} from "@bob-obringer/nextjs-sanity-io-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

interface CardProps {
  href: string;
  icon?: IconDefinition;
  label: string;
  text: string;
  logo?: SanityImageField;
}

export function MiniCard({ href, icon, logo, label, text }: CardProps) {
  return (
    <a
      href={href}
      className="bg-color-secondary hover:bg-color-primary flex w-full max-w-72 items-center gap-4 rounded border px-4 py-2 transition-colors"
    >
      {icon && <FontAwesomeIcon size="2x" width="2rem" icon={icon} />}
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
