import { CategorizedSkill } from "../../_services/sanity-io/queries.js";
import { inch, linkColor, margin, PDF, qinch, resetY } from "./helpers.js";
import { Homepage } from "@bob-obringer/sanity-io-types";
import { font } from "./create-document.js";
import { addFooter } from "./add-footer.js";

const firstColumnWidth = 336;
const secondColumnX = margin + firstColumnWidth + qinch(2);

export function addFrontPage(
  doc: PDF,
  homepage: Homepage,
  featuredSkills: Array<CategorizedSkill>,
) {
  doc
    .font("body", 12)
    // Contact Info
    .fillColor(linkColor)
    .text("bob.obringer.net", secondColumnX, margin + inch(0.3), {
      link: "https://bob.obringer.net",
      lineGap: 4,
    })
    .text("bob@obringer.net", { lineGap: 4 })
    .fillColor("black")
    .text("917-656-1685")
    // Name / Title
    .font(font.heading, 42)
    .text(homepage.title ?? "", margin, margin)
    .font(font.heading, 24)
    .text(homepage.subtitle ?? "")
    .moveDown(1);

  const currentY = doc.y;
  doc
    // Bio column
    .font(font.body, 12)
    .text(homepage.bio ?? "", { lineGap: 8, width: firstColumnWidth })
    // Move to skills column
    .text("", secondColumnX, currentY);

  for (const category of featuredSkills) {
    doc
      .font(font.title, 9)
      .fillColor("black", 0.4)
      .text(category.name)
      .moveDown(0.4)
      .font(font.body, 10)
      .fillColor("black", 1)
      .text(Array.from(category.skills).join(", "), {
        lineGap: 3,
      })
      .moveDown(1);
  }

  addFooter(
    doc,
    "The chatbot at bob.obringer.net has a more complete view of my skills and experience",
  );
  resetY(doc);
}
