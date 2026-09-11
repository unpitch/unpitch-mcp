---
description: Save the open draft as an Unpitch Document and run a Quality Check on it
allowed-tools: mcp__unpitch__get_workspace_context, mcp__unpitch__list_documents, mcp__unpitch__get_document, mcp__unpitch__create_document, mcp__unpitch__update_document, mcp__unpitch__run_quality_check, mcp__unpitch__get_run
---

Run a Quality Check on the outreach draft I am working on, using only the Unpitch tools.

1. Take the draft from the file I have open or the text I gave you: $ARGUMENTS. If it is unclear
   which text is the draft, ask me before doing anything else.
2. Call `get_workspace_context` and tell me which workspace is connected and whether a Quality
   Check is included right now or will need credits.
3. If this draft already exists as an Unpitch Document (I told you its short ID, or
   `list_documents` shows the same title), read it with `get_document` and apply my current text
   with `update_document` against that exact revision. Otherwise save it with `create_document`
   using the right document type. Never create a duplicate.
4. Call `run_quality_check` for the exact revision you just wrote. If it returns a quote instead of
   a run, show me the price and the room left in the monthly limit and wait for my explicit yes
   before confirming. Never confirm a quote on your own.
5. Poll `get_run` until the result is ready. Then give me the verdict, the findings in the order
   they appear, and the link to open the result in Unpitch.

Do not revise the draft unless I ask. Do not call any tool that is not in the list above.
