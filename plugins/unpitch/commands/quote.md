---
description: See the exact Simulation price before deciding to run it
allowed-tools: mcp__plugin_unpitch-hosted_unpitch__list_documents, mcp__plugin_unpitch-hosted_unpitch__get_document, mcp__plugin_unpitch-hosted_unpitch__list_personas, mcp__plugin_unpitch-hosted_unpitch__quote_simulation
---

Quote one Simulation for the Document and Persona I identify in $ARGUMENTS. This command must
never run a Simulation or spend credits.

If either selection is missing, show choices using `list_documents` or `list_personas` and ask.
For title lookup, follow every returned `nextCursor` unchanged as `cursor` until it is `null`
before deciding a match is unique or absent. Ask me to choose a public short ID when ambiguous,
or to supply one if pagination fails. Never guess either selection.

Read the current typed Document with `get_document`. Call `quote_simulation` with its exact
revision and content hash, the selected Persona's exact version timestamp, and a fresh
idempotency key for this quote. Reuse the key only for a retry of the same request.

Show the returned price, expiry, and room left in the monthly limit. Explain that the quote
spends nothing. If I later want to run it, use the Simulation workflow, which requires an explicit
yes tied to the displayed current quote. Never confirm a quote on my behalf. Use public short IDs.

