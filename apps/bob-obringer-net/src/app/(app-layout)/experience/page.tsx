import { Metadata } from "next";
import { getDocument } from "@/services/sanity-io-client";
import { notFound } from "next/navigation";
import { Text } from "@bob-obringer/design-system";
import { getFeaturedResumeSkills } from "@/features/sanity-io/queries/resume-skills";
import { ExperiencePageBody } from "@/app/(app-layout)/experience/_layout/experience-page-body";
import { ExperienceSkills } from "@/app/(app-layout)/experience/_components/experience-skills";

export const metadata: Metadata = {
  title: "Experience - Bob Obringer",
  description: "Bob's experience",
};

export default async function ResumePage() {
  const homepage = await getDocument("homepage");
  if (!homepage) return notFound();

  const featuredSkills = await getFeaturedResumeSkills();

  return (
    <ExperiencePageBody
      title={"Bob's Biography"}
      subtitle={homepage.subtitle ?? ""}
      body={homepage.bio?.split("\n\n").map((paragraph, index) => (
        <Text key={index} as="p" variant="body-large" className="mb-4">
          {paragraph}
        </Text>
      ))}
      sidebar={<ExperienceSkills skills={featuredSkills} />}
    />
  );
}
