import { MiniCard } from "@/components/mini-card";
import { ContactInfoWithAsset } from "@/integrations/sanity-io/queries/contact-info";
import { fab, fass } from "@awesome.me/kit-8a94ae437c/icons";

export function ContactCard({
  contactInfo,
}: {
  contactInfo: ContactInfoWithAsset;
}) {
  const { contactMethod, text, icon, iconSubset, url } = contactInfo;

  const subset = iconSubset === "fab" ? fab : fass;
  const iconFile = subset[`fa${icon}`];

  return (
    <MiniCard
      href={url ?? "/"}
      label={contactMethod ?? ""}
      text={text ?? ""}
      icon={iconFile}
    />
  );
}
