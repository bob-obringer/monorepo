import groq from "groq";
import { sanityIoClient } from "@/services/sanity-io-client";
import { ContentPage } from "@bob-obringer/sanity-io-types";

const contentPageQuery = groq`*[_type == "contentPage" && slug == $slug] | order(orderRank asc) {
  _id,
  content
}`;

export async function getContentPage(slug: string) {
  const pages = await sanityIoClient.fetch<Array<ContentPage>>(
    contentPageQuery,
    { slug },
  );
  return pages[0];
}
