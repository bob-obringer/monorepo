import { OgImage } from "@/features/page/metadata/og-image";

export async function GET() {
  return OgImage({
    title: "Experience",
  });
}
