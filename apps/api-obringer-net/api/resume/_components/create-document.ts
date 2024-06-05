import PDFDocument from "pdfkit";
import { margin, qinch } from "./helpers.js";
import { vercelBlob } from "../../_services/vercel-blob.js";

export async function createDocument() {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: margin, left: margin, right: qinch(2), bottom: 0 },
  });

  await registerFonts(doc, [
    { name: "heading", family: "YsabeauSC", style: "Bold" },
    { name: "title", family: "Montserrat", style: "SemiBold" },
    { name: "body", family: "Montserrat", style: "Regular" },
  ]);

  return doc;
}

export const font = {
  heading: "heading",
  title: "title",
  body: "body",
};

export async function registerFonts(
  doc: typeof PDFDocument,
  fontConfigs: Array<{
    name: string;
    family: string;
    style: string;
  }>,
) {
  await Promise.all(
    fontConfigs.map(({ family, name, style }) =>
      vercelBlob
        .download(`fonts/${family}/${family}-${style}.ttf`)
        .then((buffer) => doc.registerFont(name, buffer)),
    ),
  );
}
