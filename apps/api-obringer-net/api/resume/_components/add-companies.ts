import { margin, PDF, resetY } from "./helpers.js";
import { ResumeCompany } from "../../_services/sanity-io/queries.js";
import { font } from "./create-document.js";
import { addFooter } from "./add-footer.js";

export function addCompanies(doc: PDF, companies: Array<ResumeCompany>) {
  const maxPageBodyHeight = doc.page.height - margin * 2;

  let companiesOnThisPage: Array<ResumeCompany> = [];
  for (const company of companies) {
    if (doc.y !== margin) {
      const companyHeight = calculateCompanyHeight(doc, company);
      const companyBottom = doc.y + companyHeight;

      // if the bottom of the company is below the margin, end the page
      if (companyBottom > maxPageBodyHeight) {
        addCompaniesFooter(doc, companiesOnThisPage);
        companiesOnThisPage = [];
        resetY(doc);
        doc.addPage();
      }
    }
    companiesOnThisPage.push(company);
    addCompany(doc, company);
  }

  addCompaniesFooter(doc, companiesOnThisPage);
}

function addCompaniesFooter(doc: PDF, companies: Array<ResumeCompany>) {
  const companyNames = companies.reduce((accum, company, index) => {
    // todo: we should control this in the cms
    const name =
      company.name === "National Hockey League"
        ? "the NHL"
        : company.name === "Morgan Stanley Wealth Management"
          ? "Morgan Stanley"
          : company.name === "Jet.com (Walmart Labs)"
            ? "Jet.com"
            : company.name ?? "";

    if (index === 0) return name;
    if (index === companies.length - 1) return `${accum} and ${name}`;
    return `${accum}, ${name}`;
  }, "");

  addFooter(
    doc,
    `The chatbot at bob.obringer.net has more about my time at ${companyNames}`,
  );
}

export function addCompany(doc: PDF, company: ResumeCompany) {
  doc
    .font(font.heading, 24)
    .text(company.name ?? "", { lineGap: 4 })
    .font(font.title, 14)
    .text(company.position ?? "", { lineGap: 8 })
    .font(font.body, 11)
    .list(company.highlights?.map((highlight) => highlight.text) ?? [], {
      lineGap: 2,
      paragraphGap: 8,
      bulletRadius: 2,
    })
    .moveDown(1);
}

export function calculateCompanyHeight(doc: PDF, company: ResumeCompany) {
  const titleHeight = doc
    .font(font.heading, 24)
    .heightOfString(company.name ?? "", {
      lineGap: 4,
    });
  const positionHeight = doc
    .font(font.title, 14)
    .heightOfString(company.position ?? "", {
      lineGap: 8,
    });
  const highlightHeight = doc
    .font(font.body, 11)
    .heightOfString(company.highlights?.map((h) => h.text).join() ?? "", {
      lineGap: 2,
      paragraphGap: 8,
    });

  return titleHeight + positionHeight + highlightHeight;
}
