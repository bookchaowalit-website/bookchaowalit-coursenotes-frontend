import { getAllCourseNotes } from "@/lib/mdx";
import { NoteIndex } from "@/components/course-note-ui";
import Link from "next/link";

export default async function CourseNotesPage() {
  const notes = await getAllCourseNotes();

  return (
    <main className="study-atlas">
      <div className="atlas-shell">
        <header className="atlas-topbar"><Link className="atlas-wordmark" href="/">FIELD NOTES / STUDY DESK</Link><Link className="atlas-back" href="/">Back to desk</Link></header>
        <section className="listing-hero"><h1>Every note on the shelf.</h1><p>Browse the full learning archive by the facts attached to each study session.</p></section>
        <NoteIndex notes={notes} title="All course notes" description="A chronological index of the current MDX archive." />
        <footer className="atlas-footer">Source and date stay attached to every entry; content remains a personal study record.</footer>
      </div>
    </main>
  );
}
