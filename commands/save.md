---
description: Save an exact outreach draft as a new typed Unpitch Document
allowed-tools: mcp__unpitch__list_documents, mcp__unpitch__get_document, mcp__unpitch__create_document
---

Create one new Document from the exact draft I asked to save in $ARGUMENTS. A request only to
read, discuss, or check a price does not authorize a write. If the draft, title, or Document type
is unclear, ask. Include `projectShortId` only when I selected a project.

Before creation, use `list_documents` to check the intended title. Follow every returned
`nextCursor` unchanged as `cursor` until it is `null`; do not decide there is no match before
pagination completes. If it fails, stop before writing. If an exact-title match exists, ask
whether I want another Document or to update a selected public short ID. Do not create a duplicate
to avoid asking, and do not update through this command.

Use the live advertised input schema and returned typed content as the authority. Preserve the
exact body for a message, LinkedIn DM/post, social post, or article. Preserve ordered sequence
steps, supported subjects, labels, and timing instead of flattening them into one message.
For new steps use the next unused public `step-N` reference; preserve existing references on edits.
Optional fields, including recipient context, may be sent only if the live schema supports them.
If it cannot save supplied context, tell me and wait for my choice; never drop it silently or
merge it into the body without explicit permission.

Generate a fresh idempotency key for each distinct write; reuse it only for retries of that same
write. Show the returned public short ID and revision. Never expose internal UUIDs, principle IDs,
principle numbers, credentials, or raw provider data. Do not start an evaluation or spend credits.

Call `create_document` only after resolving those choices.

