import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCourseNotes, getCourseNoteBySlug } from "@/lib/mdx";

interface PageProps { params: Promise<{ slug: string }> }

export const dynamicParams = false;

export async function generateStaticParams() {
  const notes = await getAllCourseNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getCourseNoteBySlug(slug);
  if (!note) return {};
  const description = `${note.course} (${note.platform}) — study notes on ${note.topic}.`;
  return {
    title: `${note.title} — Field Notes`,
    description,
    alternates: { canonical: `/course-notes/${note.slug}` },
    openGraph: { type: "article", title: note.title, description, url: `/course-notes/${note.slug}` },
  };
}

export default async function CourseNotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getCourseNoteBySlug(slug);
  if (!note) notFound();

  return (
    <main className="study-atlas">
      <div className="atlas-shell">
        <header className="atlas-topbar"><Link className="atlas-wordmark" href="/">FIELD NOTES / STUDY DESK</Link><Link className="atlas-back" href="/course-notes">Back to index</Link></header>
        <article className="note-sheet">
          <header className="sheet-header">
            <div><span className="sheet-label">Study note / {note.topic}</span><h1>{note.title}</h1><p className="sheet-course">{note.course}</p></div>
            <div className="sheet-stamp">READ<br />/ REVISIT</div>
          </header>
          <div className="sheet-facts"><span><b>Platform</b>{note.platform}</span><span><b>Instructor</b>{note.instructor}</span><span><b>Level</b>{note.level}</span><span><b>Logged</b>{note.date ? <time dateTime={note.date}>{note.date}</time> : "—"}</span><span><b>Duration</b>{note.duration}</span></div>
          <div className="sheet-body">
            {/* JS expressions in MDX are blocked by default in next-mdx-remote v6. */}
            <MDXRemote source={note.content} />
          </div>
        </article>
        <footer className="atlas-footer">Personal study record · return to the <Link href="/course-notes">note index</Link>.</footer>
      </div>
    </main>
  );
}
