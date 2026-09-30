/**
 * Pure course-note model: frontmatter normalisation, ordering, search, and
 * topic counts. No fs/Next imports so it is unit-testable and client-safe.
 */

export interface CourseNote {
  slug: string;
  title: string;
  course: string;
  platform: string;
  topic: string;
  /** ISO date (YYYY-MM-DD) or "" when unknown. */
  date: string;
  instructor: string;
  duration: string;
  level: string;
  /** Raw MDX/markdown body. */
  content: string;
}

export type CourseNoteSummary = Omit<CourseNote, "content">;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

function text(value: unknown, fallback = ""): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizeDate(value: unknown): string {
  const raw = text(value);
  if (!raw) return "";
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? "" : new Date(parsed).toISOString().slice(0, 10);
}

export function buildNote(slug: string, data: Record<string, unknown>, content: string): CourseNote {
  return {
    slug,
    title: text(data.title, slug),
    course: text(data.course, "Untitled course"),
    platform: text(data.platform, "Unknown platform"),
    topic: text(data.topic, "general").toLowerCase(),
    date: normalizeDate(data.date),
    instructor: text(data.instructor, "—"),
    duration: text(data.duration, "—"),
    level: text(data.level, "unrated"),
    content,
  };
}

export function toSummary(note: CourseNote): CourseNoteSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...summary } = note;
  return summary;
}

/** Newest first; undated notes last, then alphabetical. */
export function sortByDate<T extends Pick<CourseNote, "date" | "title">>(notes: readonly T[]): T[] {
  return [...notes].sort((a, b) => {
    if (a.date !== b.date) {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    }
    return a.title.localeCompare(b.title);
  });
}

export function searchNotes<T extends CourseNoteSummary & { content?: string }>(
  notes: readonly T[],
  query: string,
  topic?: string,
): T[] {
  const needle = query.trim().toLowerCase();
  return notes.filter((note) => {
    if (topic && note.topic !== topic) return false;
    if (!needle) return true;
    return [note.title, note.course, note.platform, note.topic, note.instructor, note.content ?? ""].some((field) =>
      field.toLowerCase().includes(needle),
    );
  });
}

export function topicCounts(notes: readonly Pick<CourseNote, "topic">[]): { topic: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const note of notes) counts.set(note.topic, (counts.get(note.topic) ?? 0) + 1);
  return [...counts].map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}
