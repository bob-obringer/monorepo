import type { VercelRequest, VercelResponse } from "@vercel/node";
import PDFDocument from "pdfkit";
import {
  getFeaturedResumeSkills,
  getHomepage,
  getResumeCompanies,
} from "../_services/sanity-io/queries.js";
import { vercelBlob } from "../_services/vercel-blob.js";

function inch(n: number) {
  return n * 72;
}

function qinch(n: number) {
  return n * 18;
}

const margin = qinch(3);

const firstColumnWidth = 336;
const secondColumnX = margin + firstColumnWidth + qinch(2);

async function registerFonts(
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

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const homepage = await getHomepage();
  const companies = await getResumeCompanies();
  const featuredSkills = await getFeaturedResumeSkills();

  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: margin, left: margin, right: qinch(2), bottom: 0 },
  });

  await registerFonts(doc, [
    { name: "heading", family: "YsabeauSC", style: "Bold" },
    { name: "title", family: "Montserrat", style: "SemiBold" },
    { name: "body", family: "Montserrat", style: "Regular" },
  ]);

  const maxPageBodyHeight = doc.page.height - margin * 2;

  // Contact Info
  doc
    .font("body", 12)
    .fillColor([40, 112, 189])
    .text("bob.obringer.net", secondColumnX, margin + inch(0.3), {
      link: "https://bob.obringer.net",
      lineGap: 4,
    })
    .text("bob@obringer.net", {
      lineGap: 4,
    })
    .fillColor("black")
    .text("917-656-1685");

  // Name and Title
  doc
    .font("heading", 42)
    .text(homepage.title ?? "", margin, margin)
    .font("heading", 24)
    .text(homepage.subtitle ?? "", {
      baseline: "hanging",
    });

  // get resume

  doc.moveDown(1);
  const currentY = doc.y;

  // First column
  doc
    .font("body", 12)
    .text(homepage.bio ?? "", { lineGap: 8, width: firstColumnWidth });

  doc.text("", secondColumnX, currentY);

  // Second column
  for (const category of featuredSkills) {
    doc.font("title", 9).fillColor("black", 0.4).text(category.name);
    doc.moveDown(0.4);
    doc
      .font("body", 10)
      .fillColor("black", 1)
      .text(Array.from(category.skills).join(", "), {
        lineGap: 3,
      });
    doc.moveDown(1);
  }

  const bottomMargin = inch(11) - margin;
  doc
    .moveTo(margin, bottomMargin)
    .lineTo(inch(8.5) - margin, bottomMargin)
    .strokeColor("lightgray")
    .stroke();

  doc.text("", margin, bottomMargin + qinch(0.5));
  doc
    .font("body", 9)
    .fillColor("gray")
    .text(
      "Talk to my chatbot at bob.obringer.net for a more complete list of skills and experience",
      {
        align: "center",
        link: "https://bob.obringer.net",
        continued: true,
      },
    );

  doc.text("", margin, doc.y);

  doc.addPage();

  for (const company of companies) {
    if (doc.y !== margin) {
      const titleHeight = doc.heightOfString(company.name ?? "", {
        lineGap: 4,
      });
      const positionHeight = doc.heightOfString(company.position ?? "", {
        lineGap: 8,
      });
      const highlightHeight = doc.heightOfString(
        company.highlights?.map((h) => h.text).join() ?? "",
        {
          lineGap: 2,
          paragraphGap: 4,
        },
      );

      const companyBottom =
        doc.y + titleHeight + positionHeight + highlightHeight;

      if (companyBottom > maxPageBodyHeight) {
        doc.addPage();
      }
    }

    doc
      .font("heading", 24)
      .text(company.name ?? "", { lineGap: 4 })
      .font("title", 14)
      .text(company.position ?? "", { lineGap: 8 })
      .font("body", 11)
      .list(company.highlights?.map((highlight) => highlight.text) ?? [], {
        lineGap: 2,
        paragraphGap: 8,
        bulletRadius: 2,
      })
      .moveDown(1);
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="bob-obringer-resume.pdf"',
  );
  doc.pipe(res);
  doc.end();
}
