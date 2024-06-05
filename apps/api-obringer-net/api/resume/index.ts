import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getFeaturedResumeSkills,
  getHomepage,
  getResumeCompanies,
} from "../_services/sanity-io/queries.js";
import { createDocument } from "./_components/create-document.js";
import { addFrontPage } from "./_components/add-front-page.js";
import { addCompanies } from "./_components/add-companies.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const homepage = await getHomepage();
  const featuredSkills = await getFeaturedResumeSkills();
  const companies = await getResumeCompanies();

  const doc = await createDocument();
  addFrontPage(doc, homepage, featuredSkills);
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
