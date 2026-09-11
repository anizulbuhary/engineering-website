import type { MetadataRoute } from "next";
import { navigation } from "@/content/site";
import { projects } from "@/content/projects";
import { articles } from "@/content/insights";
export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.SITE_URL;
  if (!domain) return [];
  const base = new URL(domain).origin;
  return [
    ...navigation.map((n) => n.href),
    ...projects.map((p) => `/projects/${p.slug}`),
    ...articles.map((a) => `/insights/${a.slug}`),
    "/privacy",
  ].map((p) => ({ url: base + p }));
}
