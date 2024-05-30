import groq from "groq";
import { sanityIoClient } from "@/services/sanity-io-client";
import { ContactInfo, SanityImageAsset } from "@bob-obringer/sanity-io-types";

const contactInfoQuery = groq`*[_type == "contactInfo"] | order(orderRank asc) {
  _id,
  contactMethod,
  text,
  url,
  icon,
  logo{
    asset->
  }
}`;

export async function getAllContactInfo() {
  return await sanityIoClient.fetch<Array<ContactInfoWithAsset>>(
    contactInfoQuery,
  );
}

export type ContactInfoWithAsset = ContactInfo & {
  logo?: {
    asset?: SanityImageAsset;
  };
};
