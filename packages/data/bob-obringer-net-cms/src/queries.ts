import groq from "groq";

export const resumeCompanies = groq`*[_type == "resumeCompany"]`;

export const resumeCompany = groq`*[_type == "resumeCompany" && slug == $slug] | order(startDate) {
  ...,
  highlights[] {
    text,
    skills[]->{
      name,
      category->{
        name
      }
    }
  }
}`;
