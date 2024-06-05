import PDFDocument from "pdfkit";
import ColorValue = PDFKit.Mixins.ColorValue;

export type PDF = typeof PDFDocument;

export function inch(n: number) {
  return n * 72;
}

export function qinch(n: number) {
  return n * 18;
}

export const margin = qinch(3);

export function resetY(doc: PDF) {
  doc.text("", margin, doc.y);
}

export const linkColor = [40, 112, 189] as ColorValue;
