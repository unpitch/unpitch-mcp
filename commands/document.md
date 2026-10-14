---
description: Read one saved Unpitch Document and its current revision
allowed-tools: mcp__unpitch__list_documents, mcp__unpitch__get_document
---

Read the Document I identify in $ARGUMENTS using `get_document` and its public short ID.

If I give a title instead, use `list_documents` and follow every returned `nextCursor` unchanged
as `cursor` until it is `null`. Collect exact-title matches across all pages before deciding a
match is unique or absent. If several match, ask me to choose a public short ID; if pagination
fails or no match exists, ask for the public short ID. Never guess.

Show the returned content in its existing type and step order, plus its public short ID and
revision. Do not rewrite, save, or evaluate it. Never expose internal UUIDs or principle IDs.

