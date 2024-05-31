import { ContactCard } from "@/components/contact-card";
import { getAllContactInfo } from "@/features/sanity-io/queries/contact-info";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Bob Obringer",
  description: "Ways to get in touch with Bob Obringer",
};

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
