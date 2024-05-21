/*
  Get Contact Info
 */
import {
  ContactInfo,
  SanityImageAsset,
} from "@/services/sanity-io/sanity-types";
import groq from "groq";
import { sanityClient } from "@/services/sanity-io/sanity-client";

const contactInfoQuery = groq`*[_type == "contactInfo"]{
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
  return await sanityClient.fetch<Array<ContactInfoWithAsset>>(
    contactInfoQuery,
  );
}

export type ContactInfoWithAsset = ContactInfo & {
  logo?: {
    asset?: SanityImageAsset;
  };
};
