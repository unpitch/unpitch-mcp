---
description: Save the open draft as an Unpitch Document and run a Quality Check on it
allowed-tools: mcp__plugin_unpitch-hosted_unpitch__get_workspace_context, mcp__plugin_unpitch-hosted_unpitch__list_documents, mcp__plugin_unpitch-hosted_unpitch__get_document, mcp__plugin_unpitch-hosted_unpitch__create_document, mcp__plugin_unpitch-hosted_unpitch__update_document, mcp__plugin_unpitch-hosted_unpitch__run_quality_check, mcp__plugin_unpitch-hosted_unpitch__get_run
---

Run a Quality Check on the outreach draft I am working on, using only the Unpitch tools. Treat the
draft from this conversation or my open file as the source of truth. Do not rewrite it unless I ask.

1. Take the draft from the file I have open or the text I gave you: $ARGUMENTS. If it is unclear
   which text is the draft, ask me before doing anything else.
2. Call `get_workspace_context` and tell me which workspace is connected and whether a Quality
   Check is included right now or will need credits.
3. Resolve the exact Document before writing. If I supplied its short ID, read it with
   `get_document`. Otherwise use `list_documents`. Follow every returned `nextCursor` unchanged as
   `cursor` in `list_documents` until `nextCursor` is `null`, collecting exact-title matches across
   all pages. Do not conclude no exact match or one exact match before pagination completes. If
   pagination fails or cannot complete, stop before any create or update and ask for the exact
   Document public short ID. For multiple exact-title matches across any pages, ask the user to
   choose a public short ID before any write. After pagination completes, with no exact-title
   match, create it. With one exact-title match, use it only when I clearly said this is an update;
   otherwise ask. With more than one plausible match, show their titles and short IDs and ask me to
   choose. Never guess or create a duplicate to avoid the question.
4. Apply my current text with `update_document` against the exact revision, content hash, and update
   timestamp you just read. If the Document changed, read it again and ask before replacing newer
   content. For a new Document, use `create_document` with the right type and an idempotency key.
5. Call `run_quality_check` for the exact revision you just wrote. If it returns a quote instead of
   a run, show me the quoted credit amount, expiry, and room left in the monthly limit. Ask whether I
   approve that quoted spend and wait for an explicit yes tied to this quote. Never confirm a quote
   on your own; one confirmation authorizes one run.
6. Poll `get_run` until the result is ready. Then give me the verdict and findings in the order they
   appear, and include the returned run short ID. Use user-facing finding names. Never display
   internal principle IDs or principle numbers.

Do not revise the draft unless I ask. Do not call any tool that is not in the list above.
