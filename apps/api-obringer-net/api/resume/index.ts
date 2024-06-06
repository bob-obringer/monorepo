import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getAboutBob,
  getFeaturedResumeSkills,
  getResumeCompanies,
} from "../_services/sanity-io/queries.js";
import { createDocument } from "./_components/create-document.js";
import { addFrontPage } from "./_components/add-front-page.js";
import { addCompanies } from "./_components/add-companies.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const aboutBob = await getAboutBob();
  const featuredSkills = await getFeaturedResumeSkills();
  const companies = await getResumeCompanies();

  const doc = await createDocument();
  addFrontPage(doc, aboutBob, featuredSkills);
  doc.addPage();
  addCompanies(doc, companies);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="bob-obringer-resume.pdf"',
  );
  doc.pipe(res);
  doc.end();
}
