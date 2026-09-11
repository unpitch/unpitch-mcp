---
description: Quote and run an Unpitch Simulation of a Document against one Persona
allowed-tools: mcp__unpitch__get_workspace_context, mcp__unpitch__list_documents, mcp__unpitch__get_document, mcp__unpitch__list_personas, mcp__unpitch__quote_simulation, mcp__unpitch__run_simulation, mcp__unpitch__get_run
---

Simulate how a Persona reacts to one of my Documents, using only the Unpitch tools.

1. Identify the Document and the Persona from what I gave you: $ARGUMENTS. If either is missing,
   use `list_documents` or `list_personas` to show me the choices and ask.
2. Read the Document with `get_document` so you hold its current revision.
3. Call `quote_simulation` for that exact revision and Persona version. Show me the price, the room
   left in the organisation's monthly limit, and how long the quote holds.
4. Wait for my explicit yes. Only then call `run_simulation` with that quote. Never confirm a quote
   on your own, and never run more than one Simulation per confirmation.
5. Poll `get_run` until the result is ready, then summarise the reaction and give me the link to
   open it in Unpitch.

Do not call any tool that is not in the list above.
