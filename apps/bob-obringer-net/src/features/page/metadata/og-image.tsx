import { Div, OgImageWrapper } from "@/features/page/metadata/components";
import { getDocument } from "@/services/sanity-io-client";

function splitTitleIntoLines(routeTitle?: string): string[] | null {
  if (!routeTitle) return null;
  const words = routeTitle.split(" ");
  const lines = [];
  let currentLine = words[0] ?? "";

  for (let i = 1; i < words.length; i++) {
    if ((currentLine + " " + words[i]).length <= 24) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i] ?? "";
    }
  }

  lines.push(currentLine);
  return lines;
}

export async function OgImage({
  parentTitle,
  title,
}: {
  parentTitle?: string;
  title?: string;
} = {}) {
  const aboutBob = await getDocument("aboutBob");
  const titleLines = splitTitleIntoLines(title);

  return OgImageWrapper(
    <>
      {title && parentTitle && (
        <Div fontSize={50} top={40} left={90} secondary>
          {parentTitle}
        </Div>
      )}
      {titleLines?.map((line, index) => (
        <Div
          key={index}
          fontSize={80}
          top={parentTitle ? 90 + index * 80 : 40 + index * 80}
          left={93}
        >
          {line}
        </Div>
      ))}

      {title && (
        <>
          <Div fontSize={60} top={475} left={740}>
            {aboutBob?.name}
          </Div>
          <Div fontSize={30} top={540} left={665} secondary>
            {aboutBob?.title}
          </Div>
        </>
      )}

      {!title && (
        <>
          <Div fontSize={100} top={40} left={90}>
            {aboutBob?.name}
          </Div>
          <Div fontSize={50} top={150} left={95} secondary>
            {aboutBob?.title}
          </Div>
        </>
      )}
    </>,
  );
}
