---
description: Show which Unpitch workspace is connected and what is left to spend
allowed-tools: mcp__unpitch__get_workspace_context
---

Call `get_workspace_context` and report, in plain words: the connected workspace and organisation,
what evaluation capacity is included right now, the available credits, and how much room is left in
the organisation's monthly Claude Code limit and when it resets. If the call is denied, tell me the
connection needs re-authorising with `/mcp` rather than retrying.
