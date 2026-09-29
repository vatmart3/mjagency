"use client";
import type { SettingsData } from "@/lib/types";
import { useMemo } from "react";
import { db, useTable } from "@/lib/data/hooks";

export { ALL_SECTOR_IDS, DEFAULT_SETTINGS, mergeSettings } from "./settings-core";
import { mergeSettings } from "./settings-core";

export function useSettings() {
  const { rows, loading } = useTable("app_settings");
  const data = rows[0]?.data;
  // Même objet tant que la ligne ne change pas : évite les boucles dans les effets qui en dépendent
  const settings = useMemo(() => mergeSettings(data), [data]);
  return { settings, loading };
}

export async function saveSettings(patch: Partial<SettingsData>, current: SettingsData) {
  const data = { ...current, ...patch };
  await db.upsert("app_settings", { id: 1, data } as never, ["id"]);
}
