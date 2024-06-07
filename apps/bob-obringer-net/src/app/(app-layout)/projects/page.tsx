import { getContentPage } from "@/features/sanity-io/queries/content-pages";
import { Markdown } from "@/features/markdown/markdown";

export default async function Projects() {
  const markdown = await getContentPage("projects");
  return <Markdown className="p-5" markdown={markdown?.content ?? ""} />;
}
