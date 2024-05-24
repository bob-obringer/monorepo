import { Div, OgImageWrapper } from "@/features/metadata/og/components";

function splitTitleIntoLines(routeTitle?: string): string[] | null {
  if (!routeTitle) return null;
  const words = routeTitle.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if ((currentLine + " " + words[i]).length <= 25) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }

  lines.push(currentLine);
  return lines;
}

export async function OgImage({
  routeParentTitle,
  routeTitle,
}: {
  routeParentTitle?: string;
  routeTitle?: string;
} = {}) {
  const titleLines = splitTitleIntoLines(routeTitle);

  return OgImageWrapper(
    <>
      {routeTitle && routeParentTitle && (
        <Div fontSize={50} top={50} left={65} secondary>
          {routeParentTitle}
        </Div>
      )}
      {titleLines?.map((line, index) => (
        <Div
          key={index}
          fontSize={80}
          top={routeParentTitle ? 100 + index * 80 : 50 + index * 80}
          left={63}
        >
          {line}
        </Div>
      ))}

      {routeTitle && (
        <>
          <Div fontSize={60} top={475} left={750}>
            Bob Obringer
          </Div>
          <Div fontSize={30} top={550} left={675} secondary>
            Product Engineer and Architect
          </Div>
        </>
      )}

      {!routeTitle && (
        <>
          <Div fontSize={100} top={70} left={60}>
            Bob Obringer
          </Div>
          <Div fontSize={50} top={190} left={65} secondary>
            Product Engineer and Architect
          </Div>
        </>
      )}
    </>,
  );
}
