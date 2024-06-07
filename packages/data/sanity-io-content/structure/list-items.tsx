import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export function configListItem(
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

export function reordableListItem(
  S: StructureBuilder,
  context: StructureResolverContext,
  title: string,
  type: string,
) {
  return orderableDocumentListDeskItem({
    type,
    title,
    S,
    context,
  });
}

export function listItem(
  S: StructureBuilder,
  title: string,
  schemaType: string,
) {
  return S.documentTypeListItem(schemaType).title(title);
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
