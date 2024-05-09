import { createClient } from "@sanity/client";
import type {
  ResumeCompaniesResult,
  ResumeCompany,
} from "@bob-obringer/bob-obringer-net-cms/types";
import groq from "groq";

export const client = createClient({
  projectId: "gkf7pxwm",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-05-03",
});

export const resumeCompanies = groq`*[_type == "resumeCompany"] | order(startDate desc)`;

export async function getResumeCompanies() {
  return await client.fetch<ResumeCompaniesResult>(resumeCompanies);
}

export type ResumeCompanyResult = Omit<
  ResumeCompany,
  "highlights" | "industry"
> & {
  industry: {
    name: string | null;
  } | null;
  highlights: Array<{
    text: string | null;
    skills: Array<{
      name: string | null;
      category: {
        name: string | null;
        orderRank: string | null;
      } | null;
    }> | null;
  }> | null;
};

export const resumeCompany = groq`*[_type == "resumeCompany" && slug == $slug]{
  ...,
  industry->{
    name
  },
  highlights[] {
    _id,
    text,
    skills[]->{
      name,
      category->{
        name,
        orderRank
      }
    }
  }
}`;

export async function getResumeCompany({ slug }: { slug: string }) {
  const companies = await client.fetch<Array<ResumeCompanyResult>>(
    resumeCompany,
    {
      slug,
    },
  );
  return companies?.[0];
}
