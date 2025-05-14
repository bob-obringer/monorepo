import groq from "groq";
import { sanityIoClient } from "@/services/sanity-io-client";
import {
  SanityImageAsset,
  ResumeCompany as SanityResumeCompany,
} from "@bob-obringer/sanity-io-types";
import { SanityDocument } from "@sanity/client";

export type ResumeCompany = Omit<
  SanityResumeCompany,
  "highlights" | "industry"
> & {
  logo: SanityImageAsset;
  industry: {
    name: string;
  };
  highlights: Array<{
    _key: string;
    text: string;
    additionalInformation: string;
    additionalInformationForChatbot: string;
    skills: Array<{
      name: string;
      category: {
        name: string;
        orderRank: string;
      };
    }>;
  }>;
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
    additionalInformation,
    additionalInformationForChatbot,
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
  return unstable_cache(
    async () => {
      return await sanityIoClient.fetch<ResumeCompany[]>(resumeCompaniesQuery);
    },
    ['sanity:resume-companies'],
    { tags: ['sanity:resume-companies'] }
  )();
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
    additionalInformation,
    additionalInformationForChatbot,
    skills[]->{
      name,
      category->{
        name,
        orderRank
      }
    }
  }
}`;

import { unstable_cache } from "next/cache";

export async function getResumeCompany({ slug }: { slug: string }) {
  return unstable_cache(
    async () => {
      const companies = await sanityIoClient.fetch<Array<ResumeCompany>>(
        resumeCompanyQuery,
        { slug },
      );
      return companies?.[0];
    },
    [`sanity:resume-company:${slug}`],
    { tags: [`sanity:resume-company:${slug}`] }
  )();
}
