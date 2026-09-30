import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildNote, isValidSlug, normalizeDate, searchNotes, sortByDate, toSummary, topicCounts } from "../lib/course-notes.ts";

const react = buildNote("react", { title: "React", course: "React Course", platform: "Udemy", topic: "React", date: "2024-01-10" }, "## Hooks\nuseState basics");
const py = buildNote("py", { title: "Algorithms", topic: "python", date: new Date("2024-03-01") }, "Big-O notes");
const undated = buildNote("misc", { title: "Misc" }, "");

describe("course note model", () => {
  it("normalises frontmatter with defaults", () => {
    assert.equal(react.topic, "react");
    assert.equal(py.date, "2024-03-01");
    assert.equal(undated.course, "Untitled course");
    assert.equal(undated.date, "");
    assert.equal(normalizeDate("not a date"), "");
    assert.equal("content" in toSummary(react), false);
  });

  it("sorts newest first with undated notes last", () => {
    assert.deepEqual(sortByDate([undated, react, py]).map((n) => n.slug), ["py", "react", "misc"]);
  });

  it("searches metadata and body, optionally within a topic", () => {
    assert.deepEqual(searchNotes([react, py], "usestate").map((n) => n.slug), ["react"]);
    assert.deepEqual(searchNotes([react, py], "", "python").map((n) => n.slug), ["py"]);
    assert.deepEqual(searchNotes([react, py], "udemy", "python"), []);
    assert.equal(searchNotes([react, py], "  ").length, 2);
  });

  it("counts topics", () => {
    assert.deepEqual(topicCounts([react, py, react]), [
      { topic: "react", count: 2 },
      { topic: "python", count: 1 },
    ]);
  });

  it("guards slugs", () => {
    assert.equal(isValidSlug("nodejs-express"), true);
    assert.equal(isValidSlug("../secret"), false);
  });
});

describe("normalizeDate edge cases", () => {
  it("keeps the written calendar day in UTC+ zones such as Asia/Bangkok", () => {
    const previous = process.env.TZ;
    process.env.TZ = "Asia/Bangkok";
    try {
      assert.equal(normalizeDate("2024-03-05T00:00"), "2024-03-05");
      assert.equal(normalizeDate("March 5, 2024"), "2024-03-05");
      assert.equal(normalizeDate(new Date("2024-03-05")), "2024-03-05");
    } finally {
      process.env.TZ = previous;
    }
  });

  it("rejects impossible dates instead of rolling them into the next month", () => {
    assert.equal(normalizeDate("2024-02-30"), "");
    assert.equal(normalizeDate("2023-02-29"), "");
    assert.equal(normalizeDate("2024-02-29"), "2024-02-29");
  });

  it("does not let the engine guess a year from a bare number", () => {
    assert.equal(normalizeDate("5"), "");
    assert.equal(normalizeDate("12"), "");
  });
});
