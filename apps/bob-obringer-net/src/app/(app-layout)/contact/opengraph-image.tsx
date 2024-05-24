import { OgImage } from "@/features/metadata/og/og-image";

// eslint-disable-next-line @bob-obringer/next-prefer-named-exports
export default async function Image() {
  return OgImage({ title: "Contact" });
}
