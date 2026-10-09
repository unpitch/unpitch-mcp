---
name: unpitch-context
description: Show the connected Unpitch workspace, included evaluation capacity, available credits, and monthly room. Use when the user asks what is connected or available before an evaluation.
---

# Show Unpitch context

Call `get_workspace_context` once and report, in plain language:

- the connected workspace and organisation;
- what evaluation capacity is included now;
- available credits;
- room left in the organisation's monthly integration limit and when it resets.

This is a free read. Do not call a write or evaluation tool. If authorization is denied, explain
that installing the plugin did not connect the account and invoke the `setup-unpitch` workflow. Do
not retry repeatedly or claim a connection that the tool did not verify.
