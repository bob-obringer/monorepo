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
      S.documentTypeListItem("resumeCompany").title("Resume Companies"),
      orderableDocumentListDeskItem({
        type: "resumeSkillCategory",
        title: "Resume Skill Categories",
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "resumeSkill",
        title: "Resume Skill",
        S,
        context,
      }),
      S.divider(),
    ]);
}