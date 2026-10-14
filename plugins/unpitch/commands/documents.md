---
description: Browse saved Unpitch Documents without changing them
allowed-tools: mcp__plugin_unpitch-hosted_unpitch__list_documents
---

Use `list_documents` to show the Documents in my connected workspace: $ARGUMENTS

Show titles, types, and public short IDs. Follow each returned `nextCursor` unchanged as `cursor`
when I ask for more or for the complete list; stop when it is `null`. Never claim the list is
complete while another cursor exists. This command only lists Documents; do not write or evaluate.

