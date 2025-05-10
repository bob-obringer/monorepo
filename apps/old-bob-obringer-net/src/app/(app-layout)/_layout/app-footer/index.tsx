import { Footer } from "@/app/(app-layout)/_layout/app-footer/footer";
import { getDocument } from "@/services/sanity-io-client";

export async function AppFooter({ className }: { className?: string }) {
  const chatbotConfig = await getDocument("chatbotConfig");

  return <Footer className={className} chatbotConfig={chatbotConfig!} />;
}
