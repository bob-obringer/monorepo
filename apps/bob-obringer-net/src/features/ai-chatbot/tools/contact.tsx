import { RenderTool } from "@/features/ai-chatbot/tools/types";
import { ContactCard } from "@/features/contacts/contact-card";
import { getAllContactInfo } from "@/features/sanity-io/queries/contact-info";
import { z } from "zod";

export function contactTool({
  endStreams,
}: {
  endStreams: (content: string) => void;
}): RenderTool {
  return {
    description: "If the user wants to communicate with bob, run this tool",
    parameters: z.object({
      contactMethod: z.string().describe(
        `If you can infer that the user is looking for "x", "linkedin", "email", or "phone",
set the contactMethod parameter to the exact value. Remember, Twitter is X.
If you can't tell exactly how they want to communicate with us, set
the contactMethod to "all methods".`,
      ),
    }),
    generate: async function* ({ contactMethod }) {
      yield <div>Looking up contact info</div>;

      const contactInfo = await getAllContactInfo();

      const specificContactInfo = contactInfo.find(
        (c) => c.contactMethod?.toLowerCase() === contactMethod.toLowerCase(),
      );

      if (specificContactInfo) {
        endStreams(
          `[Showing Contact Tool with ${specificContactInfo} contact info]`,
        );
        return <ContactCard contactInfo={specificContactInfo} />;
      }

      endStreams("[Showing Contact Tool with all contact info]");

      return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          {contactInfo.map((contact) => (
            <ContactCard key={contact._id} contactInfo={contact} />
          ))}
        </div>
      );
    },
  };
}
