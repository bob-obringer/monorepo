import { handleResumeCompanyCreateOrUpdate } from "@/app/api/webhooks/sanity/handle-resume-company-update";
import { createSanityWebhook } from "@bob-obringer/sanity-io-webhooks";
import { env } from "@/config/server";

const { POST } = createSanityWebhook({
  secret: env.sanity.webhookSecret,
  handlers: [
    {
      documentType: "resumeCompany",
      operations: ["create", "update"],
      handler: handleResumeCompanyCreateOrUpdate,
    },
    {
      documentType: "homepage",
      operations: ["create", "update", "delete"],
      revalidatePath: "/",
    },
  ],
});

export { POST };
