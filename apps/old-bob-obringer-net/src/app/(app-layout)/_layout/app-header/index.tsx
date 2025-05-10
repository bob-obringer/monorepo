import { Text } from "@bob-obringer/components";
import { PageTitle } from "@/app/(app-layout)/_layout/app-header/page-title";
import { Header } from "@/app/(app-layout)/_layout/app-header/header";
import { getDocument } from "@/services/sanity-io-client";

export async function AppHeader({ className }: { className?: string }) {
  const aboutBob = await getDocument("aboutBob");

  return (
    <Header className={className}>
      <Text as="h2" variant="display-medium">
        {aboutBob?.name}
      </Text>
      <Text as="h1" variant="headline-large" color="secondary">
        <PageTitle />
      </Text>
    </Header>
  );
}
