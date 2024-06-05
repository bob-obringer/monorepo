import groq from "groq";
import { sanityIoClient } from "@/services/sanity-io-client";

/*
  Get Resume Skill
 */
export type ResumeSkill = {
  _id: string;
  name: string;
  category: {
    name: string;
  };
};

const resumeSkillQuery = groq`*[_type == "resumeSkill"]{
  _id,
  name,
  orderRank,
  category->{
    name
  }
} | order(orderRank asc)`;

export async function getResumeSkills() {
  return await sanityIoClient.fetch<Array<ResumeSkill>>(resumeSkillQuery);
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
  return await sanityIoClient.fetch<Array<ResumeSkill>>(
    featuredResumeSkillQuery,
  );
}
