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

function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

function isCalendarDate(year: number, month: number, day: number): boolean {
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Normalise a frontmatter date to YYYY-MM-DD as the author wrote it.
 *
 * - ISO-style values keep their calendar date: "2024-03-05T00:00" is not
 *   shifted to 2024-03-04 by a UTC conversion in UTC+ zones such as Bangkok.
 * - Impossible dates ("2024-02-30") are rejected instead of rolling over into
 *   March.
 * - Other strings must at least contain a 4-digit year, so the JS engine
 *   cannot guess "5" into 2001-05-01; their local calendar date is used.
 */
export function normalizeDate(value: unknown): string {
  const raw = text(value);
  if (!raw) return "";
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/.exec(raw);
  if (iso) {
    const [, y, m, d] = iso;
    return isCalendarDate(Number(y), Number(m), Number(d)) ? `${y}-${m}-${d}` : "";
  }
  if (!/\d{4}/.test(raw)) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${pad(parsed.getFullYear(), 4)}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
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
