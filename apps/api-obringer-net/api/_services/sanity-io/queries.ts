import groq from "groq";
import { sanityClient } from "./sanity-client.js";
import type { SanityDocument } from "@sanity/client";
import {
  SanityImageAsset,
  ResumeCompany as SanityResumeCompany,
  ResumeSkill,
  Homepage,
} from "@bob-obringer/sanity-io-types";

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
  return await sanityClient.fetch<Array<ResumeCompany>>(resumeCompaniesQuery);
}

export async function getHomepage() {
  return await sanityClient.fetch<Homepage>(groq`*[_type == "homepage"][0]`);
}

/*
  Get Featured Resume Skills
 */
const featuredResumeSkillQuery = groq`*[_type == "resumeSkill" && isFeatured == true]{
  _id,
  name,
  orderRank,
  category->{
    name
  }
} | order(orderRank asc)`;

export async function getFeaturedResumeSkills() {
  const skills = (await sanityClient.fetch<Array<ResumeSkill>>(
    featuredResumeSkillQuery,
  )) as unknown as Array<Skill>; // todo: we need run time validators for sanity
  return getCategorizedSkills(skills);
}

type Skill = {
  name: string;
  category: {
    name: string;
  };
};

type CategorizedSkill = {
  name: string;
  skills: Set<string>;
};

export function getCategorizedSkills(
  skills: Array<Skill>,
): Array<CategorizedSkill> {
  return skills.filter(isNotNull).reduce(
    (acc, { name, category }) => {
      const categoryName = category.name;

      const existingCategory = acc.find((item) => item.name === categoryName);
      if (!existingCategory) {
        acc.push({
          name: categoryName,
          skills: new Set([name]),
        });
      } else {
        existingCategory.skills.add(name);
      }
      return acc;
    },
    [] as Array<{
      name: string;
      skills: Set<string>;
    }>,
  );
}

function isNotNull<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
