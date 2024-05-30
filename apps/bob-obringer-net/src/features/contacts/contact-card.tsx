import { NextJsSanityImage } from "@bob-obringer/nextjs-sanity-io-image";

import { ContactInfoWithAsset } from "@/features/sanity-io/queries/contact-info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { Text } from "@bob-obringer/design-system";

export function ContactCard({
  contactInfo,
}: {
  contactInfo: ContactInfoWithAsset;
}) {
  const { contactMethod, text, icon, url, logo } = contactInfo;
  return (
    <a
      href={url}
      className="flex w-full max-w-72 items-center gap-4 rounded border border-[#ffffff11] bg-[#ffffff11] px-4 py-2"
    >
      {icon && (
        // @ts-expect-error can't index icons like this
        <FontAwesomeIcon size="2x" width="2rem" icon={icons[`fa${icon}`]} />
      )}
      {logo && (
        <div className="overflow-hiden h-8 w-8 rounded-full">
          <NextJsSanityImage
            width={64}
            height={64}
            alt={contactMethod ?? ""}
            sanityImage={logo}
          />
        </div>
      )}
      <div>
        <Text as="div" variant="label-small" color="secondary">
          {contactMethod}
        </Text>
        <Text as="div" variant="body-large">
          {text}
        </Text>
      </div>
    </a>
  );
}
