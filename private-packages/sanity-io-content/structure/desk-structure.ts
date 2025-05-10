import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export function structure(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  return S.list()
    .title("bob.obringer.net")
    .id("bob-obringer-net")
    .items([
      S.divider(),
      configListItem(S, "About Bob", "aboutBob"),
      configListItem(S, "Chatbot Config", "chatbotConfig"),
      // todo: this really belongs in "about bob"
      orderableDocumentListDeskItem({
        S,
        context,
        title: "Contact Info",
        type: "contactInfo",
      }),
      S.divider(),
      configListItem(S, "Homepage", "homepage"),
      S.documentTypeListItem("contentPage").title("Content Pages"),
      S.divider(),
      S.documentTypeListItem("resumeCompany").title("Resume Companies"),
      orderableDocumentListDeskItem({
        S,
        context,
        title: "Resume Skill Categories",
        type: "resumeSkillCategory",
      }),
      orderableDocumentListDeskItem({
        S,
        context,
        title: "Resume Skills",
        type: "resumeSkill",
      }),
    ]);
}

function configListItem(
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
