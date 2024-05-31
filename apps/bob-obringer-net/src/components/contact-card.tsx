import { MiniCard } from "@/components/mini-card";
import { ContactInfoWithAsset } from "@/features/sanity-io/queries/contact-info";

export function ContactCard({
  contactInfo,
}: {
  contactInfo: ContactInfoWithAsset;
}) {
  const { contactMethod, text, icon, url, logo } = contactInfo;
  return (
    <MiniCard
      href={url ?? "/"}
      label={contactMethod ?? ""}
      text={text ?? ""}
      logo={logo}
      iconName={icon}
    />
  );
}
