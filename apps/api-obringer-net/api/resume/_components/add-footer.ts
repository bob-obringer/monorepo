import { inch, margin, PDF, qinch } from "./helpers.js";
import { font } from "./create-document.js";

export function addFooter(doc: PDF, text: string) {
  const bottomMargin = inch(11) - margin;
  doc
    .moveTo(margin, bottomMargin)
    .lineTo(inch(8.5) - margin, bottomMargin)
    .strokeColor("lightgray")
    .stroke()
    .font(font.body, 9)
    .fillColor("gray")
    .text(text, margin - qinch(1), bottomMargin + qinch(0.5), {
      align: "center",
      link: "https://bob.obringer.net",
      continued: true,
    });
}
