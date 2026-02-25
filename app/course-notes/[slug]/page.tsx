import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseNoteBySlug } from "@/lib/mdx";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { getAllCourseNotes } = await import('@/lib/mdx');
  const notes = await getAllCourseNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export default async function CourseNotePage({ params }: PageProps) {
  const note = await getCourseNoteBySlug(params.slug);

  if (!note) {
    notFound();
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/course-notes"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Notes
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {note.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {note.course}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                  {note.topic}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                  {note.platform}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(note.level)}`}>
                  {note.level}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Instructor:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{note.instructor}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Duration:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{note.duration}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{note.date}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Platform:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{note.platform}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        </article>
      </main>
    </div>
  );
}