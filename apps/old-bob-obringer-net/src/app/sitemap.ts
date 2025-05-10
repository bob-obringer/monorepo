import { getResumeCompanies } from "@/features/sanity-io/queries/resume-company";
import type { MetadataRoute } from "next";

type SitemapPage = MetadataRoute.Sitemap[0];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await getResumeCompanies();
  const companyPages = companies.map(
    (company) =>
      ({
        url: `https://bob.obringer.net/experience/${company.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.5,
      }) as SitemapPage,
  );

  return [
    {
      url: "https://bob.obringer.net",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.2,
    },
    {
      url: "https://bob.obringer.net/experience",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...companyPages,
    {
      url: "https://bob.obringer.net/contact",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://bob.obringer.net/projects",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}
