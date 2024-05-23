import { createSanityWebhook } from "@bob-obringer/sanity-io-webhooks";
import { env } from "@/config/server";
import { handleResumeCompanyCreateOrUpdate } from "@/features/sanity-io/handlers/resume-company-update";

const { POST } = createSanityWebhook({
  secret: env.sanity.webhookSecret,
  handlers: [
    {
      documentType: "resumeCompany",
      operations: ["create", "update"],
      handler: handleResumeCompanyCreateOrUpdate,
      revalidatePath: "/experience",
    },
    {
      documentType: "homepage",
      operations: ["create", "update", "delete"],
      revalidatePath: "/",
    },
    {
      documentType: "contactInfo",
      operations: ["create", "update", "delete"],
      revalidatePath: "/contact",
    },
  ],
});

export { POST };
