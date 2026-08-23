import Link from "next/link";
import type { CourseNote } from "@/lib/mdx";

export function NoteCard({ note, index }: { note: CourseNote; index: number }) {
  return (
    <Link className="note-entry" href={"/course-notes/" + note.slug}>
      <span className="note-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="note-entry-main">
        <div className="note-entry-heading">
          <h3>{note.title}</h3>
          <span>{note.level}</span>
        </div>
        <p>{note.course}</p>
        <div className="note-entry-meta"><span>{note.topic}</span><span>{note.platform}</span><span>{note.duration}</span></div>
      </div>
      <span className="note-arrow" aria-hidden="true">Open</span>
    </Link>
  );
}

export function NoteIndex({ notes, title, description }: { notes: CourseNote[]; title: string; description: string }) {
  return (
    <section className="note-index" aria-labelledby="note-index-heading">
      <header className="index-heading">
        <div><span className="index-label">Archive / {notes.length} entries</span><h2 id="note-index-heading">{title}</h2></div>
        <p>{description}</p>
      </header>
      <div className="note-list">
        {notes.map((note, index) => <NoteCard key={note.slug} note={note} index={index} />)}
      </div>
    </section>
  );
}

