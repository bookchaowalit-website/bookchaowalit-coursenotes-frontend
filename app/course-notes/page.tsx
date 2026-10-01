import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourseNotes } from "@/lib/mdx";
import { toSummary, topicCounts } from "@/lib/course-notes";
import { NoteIndex } from "@/components/course-note-ui";
import { NoteBrowser } from "@/components/note-browser";

export const metadata: Metadata = {
  title: "All course notes — Field Notes",
  description: "Search the full course-note archive by topic, course, platform, or note text.",
  alternates: { canonical: "/course-notes" },
};

export default async function CourseNotesPage() {
  const notes = await getAllCourseNotes();
  const searchable = notes.map((note) => ({ ...toSummary(note), content: note.content }));
  const topics = topicCounts(notes);

  return (
    <main className="study-atlas">
      <div className="atlas-shell">
        <header className="atlas-topbar"><Link className="atlas-wordmark" href="/">FIELD NOTES / STUDY DESK</Link><Link className="atlas-back" href="/">Back to desk</Link></header>
        <section className="listing-hero"><h1>Every note on the shelf.</h1><p>Browse the full learning archive by the facts attached to each study session.</p></section>
        <Suspense fallback={<NoteIndex notes={notes.map(toSummary)} title="All course notes" description="A chronological index of the current MDX archive." />}>
          <NoteBrowser notes={searchable} topics={topics} />
        </Suspense>
        <footer className="atlas-footer">Source and date stay attached to every entry; content remains a personal study record.</footer>
      </div>
    </main>
  );
}
