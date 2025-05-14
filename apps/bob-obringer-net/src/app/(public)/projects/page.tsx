import { getContentPage } from "@/integrations/sanity-io/queries/content-pages";
import { Markdown } from "@/features/markdown/markdown";

export default async function Projects() {
  const markdown = await getContentPage("projects");
  return (
    <Markdown
      className="mx-auto max-w-screen-md p-5"
      markdown={markdown?.content ?? ""}
    />
  );
}
