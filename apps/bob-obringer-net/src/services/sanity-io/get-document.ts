import groq from "groq";
import { type ObringerAssistant, type Homepage } from "@bob-obringer/sanity-io";
import { sanityClient } from "@/services/sanity-io/sanity-client";

type SettingsTypes = {
  homepage: Homepage;
  obringerAssistant: ObringerAssistant;
};

type SettingsKey = keyof SettingsTypes;

export const settingsQuery = groq`*[_id == $settingsId]`;

export async function getDocument<K extends SettingsKey>(
  settingsId: K,
): Promise<SettingsTypes[K]> {
  const settings = await sanityClient.fetch<Array<SettingsTypes[K]>>(
    settingsQuery,
    { settingsId },
  );
  return settings[0];
}