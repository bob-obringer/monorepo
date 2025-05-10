import { OgImage } from "@/features/page/metadata/og-image";
import { getResumeCompany } from "@/integrations/sanity-io/queries/resume-company";

export default async function Image({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const company = await getResumeCompany({ slug });
  return OgImage({ title: company?.name, parentTitle: "Experience" });
}
