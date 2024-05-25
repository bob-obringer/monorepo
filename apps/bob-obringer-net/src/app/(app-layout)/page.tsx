import { Text } from "@bob-obringer/design-system";
import { getDocument } from "@/services/sanity-io/get-document";
import { notFound } from "next/navigation";

export default async function Home() {
  const homepage = await getDocument("homepage");
  if (!homepage) return notFound();

  return (
    <main className="mx-auto w-full max-w-screen-sm flex-col text-balance px-5 pt-5 md:pt-24">
      <Text
        as="h1"
        variant="display-medium"
        className="md:typography-display-large mb-4"
      >
        {homepage.title}
      </Text>
      <Text as="h2" variant="headline-large" color="secondary" className="mb-8">
        {homepage.subtitle}
      </Text>
      {homepage.bio?.split("\n\n").map((paragraph, index) => (
        <Text key={index} as="p" variant="body-large" className="mb-4">
          {paragraph}
        </Text>
      ))}
    </main>
  );
}
