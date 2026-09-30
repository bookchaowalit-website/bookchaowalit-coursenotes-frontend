import type { MetadataRoute } from "next";
import { getAllCourseNotes } from "@/lib/mdx";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getAllCourseNotes();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/course-notes`, changeFrequency: "weekly", priority: 0.8 },
    ...notes.map((note) => ({
      url: `${SITE_URL}/course-notes/${note.slug}`,
      lastModified: note.date || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/more-projects`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
