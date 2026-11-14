import type { MetadataRoute } from "next";
import { activities, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...activities.map((a) => ({ url: `${site.url}/activites/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
