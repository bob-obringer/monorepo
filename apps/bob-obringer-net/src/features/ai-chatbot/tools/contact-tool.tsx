import { ContactCard } from "@/components/contact-card";
import { getAllContactInfo } from "@/integrations/sanity-io/queries/contact-info";
import { z } from "zod";
import { RenderTool, MessageContext } from "@/features/ai-chatbot/tools/types";

export function contactTool(context: MessageContext): RenderTool {
  return {
    description: "If the user wants to communicate with bob, run this tool",
    parameters: z.object({
      contactMethod: z.string().describe(
        `If you can infer that the user is looking for "x", "linkedin", "email", or "phone",
set the contactMethod parameter to the exact value. Remember, Twitter is X.
If you can't tell exactly how they want to communicate with us, set
the contactMethod to "all methods".  Don't run this unless the user explicityly asks to contact bob.`,
      ),
    }),
    generate: async function ({ contactMethod }) {
      context.uiStream.update(<div>Looking up contact info</div>);

      const contactInfo = await getAllContactInfo();

      const specificContactInfo = contactInfo.find(
        (c) => c.contactMethod?.toLowerCase() === contactMethod.toLowerCase(),
      );

      if (specificContactInfo) {
        return context.endResponse({
          status: "success",
          aiContent: `[Showing Contact Tool with ${specificContactInfo} contact info]`,
          uiContent: <ContactCard contactInfo={specificContactInfo} />,
        });
      }

      return context.endResponse({
        status: "success",
        aiContent: `[Showing Contact Tool with all contact info]`,
        uiContent: (
          <div className="flex h-full flex-col gap-2">
            {contactInfo.map((contact) => (
              <ContactCard key={contact._id} contactInfo={contact} />
            ))}
          </div>
        ),
      });
    },
  };
}
