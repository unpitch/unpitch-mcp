---
description: Quote and run an Unpitch Simulation of a Document against one Persona
allowed-tools: mcp__plugin_unpitch-hosted_unpitch__get_workspace_context, mcp__plugin_unpitch-hosted_unpitch__list_documents, mcp__plugin_unpitch-hosted_unpitch__get_document, mcp__plugin_unpitch-hosted_unpitch__list_personas, mcp__plugin_unpitch-hosted_unpitch__quote_simulation, mcp__plugin_unpitch-hosted_unpitch__run_simulation, mcp__plugin_unpitch-hosted_unpitch__get_run
---

Simulate how a Persona reacts to one of my Documents, using only the Unpitch tools.

1. Identify the Document and the Persona from what I gave you: $ARGUMENTS. If either is missing,
   use `list_documents` or `list_personas` to show me the choices and ask.
2. Read the Document with `get_document` so you hold its current revision.
3. Call `quote_simulation` for that exact revision and Persona version. Show me the price, the room
   left in the organisation's monthly limit, and how long the quote holds.
4. Ask whether I approve that quoted credit spend and wait for an explicit yes tied to this quote.
   Only then call `run_simulation` with that quote. Never confirm a quote on your own, and never run
   more than one Simulation per confirmation.
5. Poll `get_run` until the result is ready, then summarise the returned reaction and include the
   returned run short ID. Use user-facing names and never display internal principle IDs or
   principle numbers. Do not rewrite the Document unless I separately ask.

Do not call any tool that is not in the list above.
