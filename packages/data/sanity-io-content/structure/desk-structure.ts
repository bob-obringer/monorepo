import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import {
  configItem,
  contactInfoListItem,
  resumeCompaniesListItem,
  resumeSkillCategoriesListItem,
  resumeSkillsListItem,
} from "./list-items";

export function structure(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  return S.list()
    .title("bob.obringer.net")
    .id("bob-obringer-net")
    .items([
      S.divider(),
      configItem(S, "About Bob", "aboutBob"),
      configItem(S, "Homepage", "homepage"),
      configItem(S, "Chatbot Config", "chatbotConfig"),
      S.divider(),
      contactInfoListItem(S, context),
      S.divider(),
      resumeCompaniesListItem(S),
      resumeSkillCategoriesListItem(S, context),
      resumeSkillsListItem(S, context),
    ]);
}
