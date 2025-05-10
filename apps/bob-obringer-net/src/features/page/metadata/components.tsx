import { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { vercelBlob } from "@/services/vercel-blob";

export async function OgImageWrapper(children: ReactNode) {
  const displayFont = await vercelBlob.download(
    "fonts/YsabeauSC/YsabeauSC-Bold.ttf",
  );
  const background = await vercelBlob.getFileInfo("images/og-background.png");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          fontFamily: '"display"',
          display: "flex",
          color: "white",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ position: "absolute" }}
          alt="Bob Obringer"
          src={background?.url}
        />
        {children}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "display",
          data: displayFont,
          style: "normal",
        },
      ],
    },
  );
}

export function Div({
  fontSize,
  top,
  left,
  children,
  secondary,
}: {
  fontSize: number;
  top: number;
  left: number;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <div
      style={{
        fontSize,
        opacity: secondary ? 0.5 : 1,
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {children}
    </div>
  );
}
