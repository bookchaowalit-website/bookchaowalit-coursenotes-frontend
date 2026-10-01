import { getAllCourseNotes } from "@/lib/mdx";
import { NoteIndex } from "@/components/course-note-ui";
import Link from "next/link";
import { toSummary, topicCounts } from "@/lib/course-notes";

export default async function Home() {
  const notes = await getAllCourseNotes();
  const topics = topicCounts(notes);

  return (
    <main className="study-atlas">
      <span className="contract-mark" dangerouslySetInnerHTML={{ __html: "<!-- THESIS: course notes are a learning archive, not generic cards; FINISH: topic index, chronological entries, readable note shelf -->" }} />
      <div className="atlas-shell">
        <header className="atlas-topbar">
          <Link className="atlas-wordmark" href="/">FIELD NOTES / STUDY DESK</Link>
          <span>private learning archive · {notes.length} entries</span>
        </header>
        <section className="atlas-hero">
          <div className="hero-copy">
            <h1>Keep the thread between classes.</h1>
            <p>Course notes gathered as a working study archive: what was learned, where it came from, and which ideas are worth reopening.</p>
          </div>
          <aside className="atlas-card">
            <span className="atlas-card-label">Current shelf</span>
            <strong>{notes.length}</strong>
            <span>notes indexed across<br />{topics.length} topics</span>
          </aside>
        </section>
        <div className="atlas-content">
          <nav className="topic-rail" aria-label="Topics">
            <span className="rail-heading">Topic index</span>
            {topics.map(({ topic, count }) => <Link className="topic-row" key={topic} href={`/course-notes?topic=${encodeURIComponent(topic)}`}><span>{topic}</span><span>{count}<span className="sr-only"> notes</span></span></Link>)}
            <p className="rail-note">Each entry keeps its source course, platform, level, and date beside the notes.</p>
          </nav>
          <NoteIndex notes={notes.slice(0, 6).map(toSummary)} title="Recent study" description="Start with the newest note, then follow a topic or course into the full shelf." />
        </div>
        <footer className="atlas-footer">The archive is local content in MDX. It does not claim a course completion record or replace the original source.</footer>
      </div>
    </main>
  );
}
