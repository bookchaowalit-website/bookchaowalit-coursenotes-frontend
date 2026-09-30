# Upgrade plan

## Current state: 8/10 (was 4/10)

Notes now render as formatted text instead of raw markdown, the archive is
searchable/filterable, MCP tools are real, and CI guards lint/types/tests/build.

## Backlog

### P0
- (none open)

### P1
- Confirm canonical domain; set `NEXT_PUBLIC_SITE_URL`.
- Refresh `PRODUCT.md` ("Source README excerpt" still quotes create-next-app).
- Syntax highlighting for fenced code blocks (e.g. `rehype-pretty-code`),
  once notes contain code.

### P2
- "Revisit" marker per note stored in `localStorage`.
- Remove unused deps (`lucide-react`, `@types/mdx`) after confirming.

## Done in this pass
- Fixed note pages injecting raw markdown with `dangerouslySetInnerHTML`
  (unrendered `##` text and an HTML-injection path); now rendered with
  `next-mdx-remote/rsc`.
- Pure, unit-tested note model (`lib/course-notes.ts`): frontmatter defaults,
  date normalisation, newest-first ordering, search, topic counts, slug guard.
- `next.config.ts`: removed `ignoreBuildErrors`, unsupported `eslint` key and
  dev polling hack; fixed the type errors they hid.
- Replaced sample-data `/api/mcp` with real note tools.
- Archive search + topic filter; home topic index links to filtered archive;
  per-note metadata; full sitemap; CI; README rewritten.
