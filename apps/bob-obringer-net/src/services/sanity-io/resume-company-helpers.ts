import groq from "groq";
import { sanityClient } from "@/services/sanity-io/sanity-client";
import {
  SanityImageAsset,
  ResumeCompany as SanityResumeCompany,
} from "@bob-obringer/sanity-io";
import { SanityDocument } from "@sanity/client";

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

/*
  Get Resume Company
 */

const resumeCompanyQuery = groq`*[_type == "resumeCompany" && slug == $slug]{
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
  const companies = await sanityClient.fetch<Array<ResumeCompany>>(
    resumeCompanyQuery,
    { slug },
  );
  return companies?.[0];
}
