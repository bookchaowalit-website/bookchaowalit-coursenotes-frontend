import { getAllCourseNotes, getCourseNoteBySlug, getTopics, searchCourseNotes } from "@/lib/mdx";
import { toSummary } from "@/lib/course-notes";
import { ToolInputError, optionalString, requireString, respondToMcpRequest } from "@/lib/mcp";
import type { McpTool } from "@/lib/mcp";

const SERVER = { name: "bookchaowalit-coursenotes", version: "0.2.0" };

const TOOLS: McpTool[] = [
  {
    name: "list_course_notes",
    description: "List course notes (newest first), optionally filtered by topic.",
    inputSchema: { type: "object", properties: { topic: { type: "string" } } },
    handler: async (args) => {
      const topic = optionalString(args, "topic")?.toLowerCase();
      const notes = await getAllCourseNotes();
      return notes.filter((note) => !topic || note.topic === topic).map(toSummary);
    },
  },
  {
    name: "get_course_note",
    description: "Get one course note, including its markdown body, by slug (e.g. react-fundamentals).",
    inputSchema: { type: "object", properties: { slug: { type: "string" } }, required: ["slug"] },
    handler: async (args) => {
      const note = await getCourseNoteBySlug(requireString(args, "slug"));
      if (!note) throw new ToolInputError("No course note with that slug.");
      return note;
    },
  },
  {
    name: "search_course_notes",
    description: "Search note titles, courses, platforms, instructors, topics, and body text.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" }, topic: { type: "string" } },
      required: ["query"],
    },
    handler: async (args) =>
      (await searchCourseNotes(requireString(args, "query"), optionalString(args, "topic")?.toLowerCase())).map(toSummary),
  },
  {
    name: "list_topics",
    description: "List topics with the number of notes in each.",
    inputSchema: { type: "object", properties: {} },
    handler: () => getTopics(),
  },
];

export async function POST(request: Request) {
  return respondToMcpRequest(request, SERVER, TOOLS);
}
