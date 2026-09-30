import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { buildNote, isValidSlug, searchNotes, sortByDate, topicCounts } from "./course-notes";
import type { CourseNote } from "./course-notes";

export type { CourseNote, CourseNoteSummary } from "./course-notes";

const CONTENT_DIR = path.join(process.cwd(), "content", "course-notes");

async function readNote(slug: string): Promise<CourseNote> {
  const source = await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(source);
  return buildNote(slug, data, content);
}

export async function getAllCourseNotes(): Promise<CourseNote[]> {
  const files = await fs.readdir(CONTENT_DIR);
  const slugs = files.filter((file) => file.endsWith(".mdx")).map((file) => file.slice(0, -4)).filter(isValidSlug);
  return sortByDate(await Promise.all(slugs.map(readNote)));
}

export async function getCourseNoteBySlug(slug: string): Promise<CourseNote | null> {
  if (!isValidSlug(slug)) return null;
  try {
    return await readNote(slug);
  } catch {
    return null;
  }
}

export async function searchCourseNotes(query: string, topic?: string): Promise<CourseNote[]> {
  return searchNotes(await getAllCourseNotes(), query, topic);
}

export async function getTopics() {
  return topicCounts(await getAllCourseNotes());
}
