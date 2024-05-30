import groq from "groq";
import { sanityClient } from "../sanity-client.js";
import type {
  SanityImageAsset,
  ResumeCompany as SanityResumeCompany,
} from "../sanity-types.js";
import type { SanityDocument } from "@sanity/client";

export type ResumeCompany = Omit<
  SanityResumeCompany,
  "highlights" | "industry"
> & {
  logo: SanityImageAsset | null;
  industry: {
    name: string | null;
  } | null;
  highlights: Array<{
    _key: string;
    text: string | null;
    skills: Array<{
      name: string | null;
      category: {
        name: string | null;
        orderRank: string | null;
      } | null;
    }> | null;
  }> | null;
} & SanityDocument;

/*
  Get Resume Companies
 */
const resumeCompaniesQuery = groq`*[_type == "resumeCompany"]{
  ...,
    logo {
    ...,
    asset->{
      ...,
      metadata
    }
  },
  industry->{
    name
  },
  highlights[]{
    _key,
    text,
    skills[]->{
      name,
      category->{
        name,
        orderRank
      }
    }
  }
} | order(startDate desc)`;

export async function getResumeCompanies() {
  return await sanityClient.fetch<ResumeCompany[]>(resumeCompaniesQuery);
}

export async function getHomepage() {
  return await sanityClient.fetch(groq`*[_type == "homepage"][0]`);
}
