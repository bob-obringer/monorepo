import { ContactCard } from "@/features/contacts/contact-card";
import { getAllContactInfo } from "@/services/sanity-io/contact-info-helpers";

export default async function ContactPage() {
  const contacts = await getAllContactInfo();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 pt-20">
      {contacts.map((contactInfo) => (
        <ContactCard key={contactInfo._id} contactInfo={contactInfo} />
      ))}
    </div>
  );
}
