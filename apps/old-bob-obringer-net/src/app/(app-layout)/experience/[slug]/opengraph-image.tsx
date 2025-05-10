import { OgImage } from "@/features/metadata/og/og-image";
import { getResumeCompany } from "@/features/sanity-io/queries/resume-company";

// eslint-disable-next-line @bob-obringer/next-prefer-named-exports
export default async function Image({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const company = await getResumeCompany({ slug });
  return OgImage({ title: company?.name, parentTitle: "Experience" });
}
