import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import {
  chatbotConfigListItem,
  contactInfoListItem,
  homepageListItem,
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
      homepageListItem(S),
      chatbotConfigListItem(S),
      S.divider(),
      contactInfoListItem(S, context),
      S.divider(),
      resumeCompaniesListItem(S),
      resumeSkillCategoriesListItem(S, context),
      resumeSkillsListItem(S, context),
    ]);
}
