import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface CourseNote {
  title: string;
  course: string;
  platform: string;
  topic: string;
  date: string;
  instructor: string;
  duration: string;
  level: string;
  content: string;
  slug: string;
}

export async function getAllCourseNotes() {
  const contentDir = path.join(process.cwd(), 'content', 'course-notes');
  const files = await fs.readdir(contentDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  const notes = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        ...data,
        slug: file.replace('.mdx', ''),
        content
      } as CourseNote;
    })
  );

  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getCourseNoteBySlug(slug: string) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'course-notes');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      ...data,
      slug,
      content
    } as CourseNote;
  } catch (error) {
    return null;
  }
}

export async function searchCourseNotes(query: string) {
  const notes = await getAllCourseNotes();
  const lowercaseQuery = query.toLowerCase();

  return notes.filter(note =>
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.course.toLowerCase().includes(lowercaseQuery) ||
    note.platform.toLowerCase().includes(lowercaseQuery) ||
    note.topic.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery)
  );
}

export async function getTopics() {
  const notes = await getAllCourseNotes();
  const topics = [...new Set(notes.map(note => note.topic))];
  return topics;
}