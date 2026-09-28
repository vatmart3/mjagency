"use client";
import { db, useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import type { Favorite } from "@/lib/types";

export function useFavorites() {
  const { rows } = useTable("favorites");
  const { me } = useSession();
  const mine = rows.filter((f) => f.user_id === me?.id);
  const has = (kind: Favorite["kind"], key: string) => mine.some((f) => f.kind === kind && f.key === key);
  async function toggle(kind: Favorite["kind"], key: string) {
    if (!me) return;
    if (has(kind, key)) await db.removeWhere("favorites", { user_id: me.id, kind, key });
    else await db.upsert("favorites", { user_id: me.id, kind, key }, ["user_id", "kind", "key"]);
  }
  return { favorites: mine, has, toggle };
}
