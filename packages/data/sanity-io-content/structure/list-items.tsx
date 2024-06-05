import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export function homepageListItem(S: StructureBuilder) {
  return S.listItem()
    .title("Homepage")
    .child(
      S.document()
        .title("Homepage")
        .schemaType("homepage")
        .documentId("homepage"),
    );
}

export function contactInfoListItem(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  return orderableDocumentListDeskItem({
    type: "contactInfo",
    title: "Contact Info",
    S,
    context,
  });
}

export function resumeCompaniesListItem(S: StructureBuilder) {
  return S.documentTypeListItem("resumeCompany").title("Resume Companies");
}

export function resumeSkillCategoriesListItem(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  return orderableDocumentListDeskItem({
    type: "resumeSkillCategory",
    title: "Resume Skill Categories",
    S,
    context,
  });
}

export function skillItemsByCategory(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  return orderableDocumentListDeskItem({
    type: "resumeSkillCategory",
    title: "Resume Skill Categories",
    S,
    context,
  });
}

export function resumeSkillsListItem(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  return orderableDocumentListDeskItem({
    type: "resumeSkill",
    title: "Resume Skills",
    S,
    context,
  });
}

export function chatbotConfigListItem(S: StructureBuilder) {
  return S.listItem()
    .title("Chatbot Config")
    .child(
      S.document()
        .title("Chatbot Config")
        .schemaType("chatbotConfig")
        .documentId("chatbotConfig"),
    );
}
