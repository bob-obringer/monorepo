import { Metadata } from "next";
import { getDocument } from "@/services/sanity-io-client";
import { notFound } from "next/navigation";
import { Text } from "@bob-obringer/design-system";
import { getFeaturedResumeSkills } from "@/features/sanity-io/queries/resume-skills";
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
    <div className="flex flex-col space-y-10 md:flex-row md:space-x-10 md:space-y-0">
      <main className="flex-[2] text-balance">
        {homepage.bio?.split("\n\n").map((paragraph, index) => (
          <Text key={index} as="p" variant="body-large" className="mb-4">
            {paragraph}
          </Text>
        ))}
      </main>
      <div className="flex flex-[1] flex-col space-y-5">
        <ExperienceSkills skills={featuredSkills} />
      </div>
    </div>
  );
}
