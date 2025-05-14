import { ContactCard } from "@/components/contact-card";
import { getAllContactInfo } from "@/integrations/sanity-io/queries/contact-info";
import { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact - Bob Obringer",
  description: "Ways to get in touch with Bob Obringer",
};

export default async function ContactPage() {
  const contacts = await getAllContactInfo();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 pt-10">
      {contacts.map((contactInfo) => (
        <ContactCard key={contactInfo._id} contactInfo={contactInfo} />
      ))}
    </div>
  );
}
