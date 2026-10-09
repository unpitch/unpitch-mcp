---
description: Read workspace, Document, business, Persona, or evaluation context from Unpitch
allowed-tools: mcp__unpitch__get_workspace_context, mcp__unpitch__list_documents, mcp__unpitch__get_document, mcp__unpitch__search_knowledge, mcp__unpitch__list_personas, mcp__unpitch__get_run
---

Use only the read-only Unpitch tools above to answer: $ARGUMENTS

- With no more specific request, call `get_workspace_context` and report the connected workspace
  and organisation, included evaluation capacity, available credits, monthly room, and reset time.
- For a Document, use `list_documents` to resolve a title or `get_document` for a supplied public
  short ID. Show choices when a title is ambiguous; never guess.
- For a business question, call `search_knowledge` with the concrete query and summarize the
  returned workspace excerpts with useful source attribution.
- For Personas, call `list_personas`. For an evaluation, call `get_run` with its public run short
  ID and report its state or completed public result.

Do not write a Document or start an evaluation. Use public short IDs and user-facing names; never
display internal UUIDs, principle IDs, or principle numbers. If a call is denied, tell me the
connection needs re-authorising from the client's MCP or connector settings; in Claude Code, use
`/mcp`. Do not retry repeatedly.
