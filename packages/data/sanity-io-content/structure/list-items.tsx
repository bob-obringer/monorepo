import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export function configItem(
  S: StructureBuilder,
  title: string,
  schemaType: string,
) {
  return S.listItem()
    .title(title)
    .child(
      S.document().title(title).schemaType(schemaType).documentId(schemaType),
    );
}

export function homepageListItem(S: StructureBuilder) {
  return configItem(S, "Homepage", "homepage");
}

export function chatbotConfigListItem(S: StructureBuilder) {
  return configItem(S, "Chatbot Config", "chatbotConfig");
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
