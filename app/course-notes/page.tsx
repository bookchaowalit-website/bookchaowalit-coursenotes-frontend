import Link from "next/link";
import { getAllCourseNotes } from "@/lib/mdx";

export default async function CourseNotesPage() {
  const notes = await getAllCourseNotes();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Course Notes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Browse my collection of course notes organized by topic and platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/course-notes/${note.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {note.course}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                    {note.topic}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                    {note.platform}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div>👤 {note.instructor}</div>
                  <div>⏱️ {note.duration}</div>
                  <div>📚 {note.level}</div>
                  <div>📅 {note.date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}