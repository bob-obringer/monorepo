import groq from "groq";
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

export type Homepage = {
  _id: string;
  _type: "homepage";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  subtitle?: string;
  description?: string;
  bio?: string;
};

export type ObringerAssistant = {
  _id: string;
  _type: "obringerAssistant";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  systemPrompt?: string;
};
