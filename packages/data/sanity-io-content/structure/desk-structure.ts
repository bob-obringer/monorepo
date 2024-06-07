import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { configListItem, listItem, reordableListItem } from "./list-items";

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
      reordableListItem(S, context, "Contact Info", "contactInfo"),
      S.divider(),
      configListItem(S, "Homepage", "homepage"),
      listItem(S, "Content Page", "contentPage"),
      S.divider(),
      listItem(S, "Resume Companies", "resumeCompany"),
      reordableListItem(
        S,
        context,
        "Resume Skill Categories",
        "resumeSkillCategory",
      ),
      reordableListItem(S, context, "Resume Skills", "resumeSkill"),
    ]);
}
