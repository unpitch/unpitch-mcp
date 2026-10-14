---
description: Read an Unpitch evaluation result without starting another run
allowed-tools: mcp__plugin_unpitch-hosted_unpitch__get_run
---

Read the evaluation identified by its public run short ID in $ARGUMENTS using `get_run`.
If I have not supplied a run short ID or an unambiguous one from this conversation, ask for it.
Do not substitute a Document short ID or an internal UUID.

Report the returned state. If complete, summarize the public result and include its run short ID.
Keep historical results tied to the revision actually evaluated; do not claim they describe a
newer draft. Use user-facing finding names and never display internal principle IDs or numbers.
Do not start or retry an evaluation, rewrite a Document, or spend credits.

