import { Header } from "@/app/_/layout/app-header/header";
import { getDocument } from "@/services/sanity-io-client";

// const titles: Record<string, string> = {
//   experience: "Experience",
//   stack: "Stack",
//   contact: "Contact",
//   projects: "Projects",
// };

export async function HeaderServer({ className }: { className?: string }) {
  const aboutBob = await getDocument("aboutBob");
  return <Header className={className} aboutBob={aboutBob} />;
}
