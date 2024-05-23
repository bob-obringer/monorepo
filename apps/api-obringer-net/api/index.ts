import type { VercelRequest, VercelResponse } from "@vercel/node";
import PDFDocument from "pdfkit";
import {
  getHomepage,
  getResumeCompanies,
} from "./sanity-io/queries/resume-company.js";
import fs from "fs";
import path from "node:path";

function inch(n: number) {
  return n * 72;
}

const margin = inch(0.75);

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const doc = new PDFDocument({
    size: "LETTER",
    margin,
  });

  const heading = fs.readFileSync(
    path.resolve(process.cwd(), "api/fonts", "YsabeauSC-Bold.ttf"),
  );
  const title = fs.readFileSync(
    path.resolve(process.cwd(), "api/fonts", "ArgentumNovus-Medium.ttf"),
  );
  const body = fs.readFileSync(
    path.resolve(process.cwd(), "api/fonts", "ArgentumNovus-Regular.ttf"),
  );

  doc.registerFont("heading", heading);
  doc.registerFont("title", title);
  doc.registerFont("body", body);

  const maxPageBodyHeight = doc.page.height - margin;

  // Contact Info
  doc
    .font("body", 12)
    .fillColor([40, 112, 189])
    .text("bob.obringer.net", margin, margin, {
      align: "right",
      baseline: "hanging",
      lineGap: 4,
    })
    .text("bob@obringer.net", {
      align: "right",
      baseline: "hanging",
      lineGap: 4,
    })
    .fillColor("black")
    .text("917-656-1685", {
      align: "right",
      baseline: "hanging",
    });

  // Name and Title
  doc
    .font("heading", 42)
    .text("Bob Obringer", margin, margin, { baseline: "hanging" })
    .moveUp(0.2)
    .font("heading", 24)
    .text("Product Architect", {
      baseline: "hanging",
    });

  // get resume
  const homepage = await getHomepage();
  doc.moveDown(1);
  doc.font("body", 14).text(homepage.bio, { lineGap: 8 });

  const companies = await getResumeCompanies();

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
      .font("body", 12)
      .list(company.highlights?.map((highlight) => highlight.text) ?? [], {
        lineGap: 2,
        paragraphGap: 4,
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

//
// // const port = 3000;
// // app.listen(port, () => {
// //   return console.log(`Server is listening on ${port}`);
// // });
