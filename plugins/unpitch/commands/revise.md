---
description: Apply a requested change to an exact Unpitch Document revision
allowed-tools: mcp__plugin_unpitch-hosted_unpitch__list_documents, mcp__plugin_unpitch-hosted_unpitch__get_document, mcp__plugin_unpitch-hosted_unpitch__update_document
---

Update the Document I explicitly asked to change in $ARGUMENTS. Resolve its public short ID
with `list_documents` if needed: follow every returned `nextCursor` unchanged as `cursor`
until it is `null` before deciding a title is unique or absent. If pagination fails, stop and
ask for the public short ID. For ambiguous matches, ask me to choose; never guess.

Before `update_document`, read it with `get_document` and branch on the returned status. If the
read errors or returns `not_found`, stop without mutating. For `content_too_large`, explain that
the unseen original content cannot be preserved and never send `content` for a localized content
edit. A requested metadata-only edit may proceed using the returned exact revision metadata. Send
`content` only when I explicitly supplied the complete replacement and authorized replacing the
entire Document. For any permitted write, pass the exact public short ID, `expectedRevision`,
`expectedContentHash`, and `expectedUpdatedAt` from that read, and apply only my requested changes.
On a stale conflict, read again, explain the newer version, and ask before reapplying my change.
Never overwrite through a conflict or create a duplicate to avoid it.

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

