import { Metadata } from "next";
import { getDocument } from "@/services/sanity-io-client";
import { P } from "@bob-obringer/design-system";
import { getFeaturedResumeSkills } from "@/integrations/sanity-io/queries/resume-skills";
import { ExperiencePageBody } from "@/app/(public)/experience/_layout/experience-page-body";
import { ExperienceSkills } from "@/app/(public)/experience/_components/experience-skills";

export const metadata: Metadata = {
  title: "Experience - Bob Obringer",
  description: "Bob's experience",
};

export default async function ResumePage() {
  const aboutBob = await getDocument("aboutBob");
  const featuredSkills = await getFeaturedResumeSkills();

  return (
    <ExperiencePageBody
      body={aboutBob?.bio?.split("\n\n").map((paragraph, index) => (
        <P key={index} as="p" variant="body-large" className="mb-4">
          {paragraph}
        </P>
      ))}
      sidebar={
        <>
          <ExperienceSkills skills={featuredSkills} />
          {/*<hr className="border-color-tertiary my-4" />*/}
          <P
            as="p"
            variant="body-small"
            color="faint"
            className="mt-4 text-balance"
          >
            Additional skills available under each company and in the chatbot
          </P>
        </>
      }
    />
  );
}
