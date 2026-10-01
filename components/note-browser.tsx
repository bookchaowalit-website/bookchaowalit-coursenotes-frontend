"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchNotes } from "@/lib/course-notes";
import type { CourseNoteSummary } from "@/lib/course-notes";
import { NoteCard } from "@/components/course-note-ui";

type SearchableNote = CourseNoteSummary & { content: string };

export function NoteBrowser({ notes, topics }: { notes: SearchableNote[]; topics: { topic: string; count: number }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const requestedTopic = params.get("topic") ?? "";
  const topic = topics.some((entry) => entry.topic === requestedTopic) ? requestedTopic : "";
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchNotes(notes, query, topic || undefined), [notes, query, topic]);

  const selectTopic = (next: string) => {
    router.replace(next ? `/course-notes?topic=${encodeURIComponent(next)}` : "/course-notes", { scroll: false });
  };

  return (
    <section className="note-index" aria-labelledby="note-index-heading">
      <header className="index-heading">
        <div><span className="index-label">Archive / {results.length} of {notes.length} entries</span><h2 id="note-index-heading">{topic ? `Notes on ${topic}` : "All course notes"}</h2></div>
        <p>Search titles, courses, instructors, and the note text itself.</p>
      </header>
      <div className="note-filters">
        <label htmlFor="note-search">Search</label>
        <input id="note-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. hooks, Big-O, middleware" autoComplete="off" />
        <label htmlFor="note-topic">Topic</label>
        <select id="note-topic" value={topic} onChange={(event) => selectTopic(event.target.value)}>
          <option value="">All topics</option>
          {topics.map((entry) => <option key={entry.topic} value={entry.topic}>{entry.topic} ({entry.count})</option>)}
        </select>
      </div>
      <p className="sr-only" aria-live="polite">{results.length} notes shown</p>
      {results.length === 0 ? (
        <p className="note-empty">No note matches this search.</p>
      ) : (
        <div className="note-list">
          {results.map((note, index) => <NoteCard key={note.slug} note={note} index={index} />)}
        </div>
      )}
    </section>
  );
}
