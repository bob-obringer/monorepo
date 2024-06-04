import { OgImage } from "@/features/metadata/og/og-image";

export const contentType = "image/png";
export const alt = "Bob Obringer";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return OgImage();
}
