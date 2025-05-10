import { Div } from "@bob-obringer/design-system";
import {
  NextJsSanityImage,
  SanityImageField,
} from "@bob-obringer/nextjs-sanity-io/image";
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
      className="border-foreground/10 bg-background hover:bg-bg-highlight flex w-full max-w-72 items-center gap-4 rounded-lg border px-4 py-2 transition-colors"
    >
      {/* @ts-expect-error todo: fixme */}
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
        <Div variant="label" color="subtle">
          {label}
        </Div>
        <Div variant="body-medium">{text}</Div>
      </div>
    </a>
  );
}
