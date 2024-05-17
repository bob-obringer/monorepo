import { sanityClient } from "@/services/sanity-io/sanity-client";
import groq from "groq";

let _industriesById: Map<string, string | null>;

export async function getIndustryById(id?: string) {
  if (!id) return null;
  if (!_industriesById) {
    const industries = await getResumeIndustries();
    _industriesById = new Map(industries.map(({ _id, name }) => [_id, name]));
  }
  return _industriesById.get(id);
}

async function getResumeIndustries() {
  return await sanityClient.fetch<Array<{ _id: string; name: string | null }>>(
    groq`*[_type == "resumeIndustry"]{ _id, name }`,
  );
}
