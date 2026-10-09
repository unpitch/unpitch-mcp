---
name: use-unpitch
description: Use Unpitch naturally to read workspace data, find business context, save or update typed Documents, inspect evaluation results, or route a Quality Check or ICP Simulation. Use for any Unpitch request that is broader than one focused workflow.
---

# Use Unpitch

Treat this as the natural-language router for Unpitch. Infer the smallest workflow from the user's
request; do not make the user choose a tool, command, or setup path.

## Tool registry

| Tool | Use |
| --- | --- |
| `get_workspace_context` | Verify the authorized workspace and read capacity, credits, and monthly spend room. |
| `list_documents` | Browse Documents and their public revision identities. |
| `get_document` | Read one Document's typed content by public short ID. |
| `search_knowledge` | Find workspace-scoped business context for a specific question. |
| `list_personas` | Browse eligible ICP Personas and their public version timestamps. |
| `create_document` | Save one new typed Document after explicit write intent. |
| `update_document` | Apply an explicitly requested, revision-checked Document change. |
| `run_quality_check` | Start or confirm a Quality Check for one exact Document revision. |
| `quote_simulation` | Quote one Simulation without spending credits. |
| `run_simulation` | Confirm one approved quote and start its Simulation. |
| `get_run` | Read an evaluation's state and public result by run short ID. |

## Route the request

- For a Quality Check, follow `$check-outreach`.
- For a Simulation, follow `$simulate-outreach`.
- To browse or choose an ICP Persona without spending, follow `$choose-unpitch-reader`.
- For connection, capacity, credit, or monthly-limit questions, follow `$unpitch-context`.
- During setup, follow `$setup-unpitch`. Setup is read-only.
- Handle standalone Document reads and writes, Knowledge Base searches, and evaluation-result reads
  directly with the rules below.

Do not add an evaluation to a read or Document request unless the user asked for it. Quoted
evaluation spend always stays inside the focused Quality Check or Simulation workflow: show the
exact quote, wait for explicit approval tied to that quote, and use one confirmation for one run.

## Read without changing data

- Use `list_documents` to find a Document when the user did not provide its short ID. Follow every
  returned `nextCursor` unchanged as `cursor` in `list_documents` until `nextCursor` is `null`,
  collecting exact-title matches across all pages. Do not conclude no exact match or one exact
  match before pagination completes. If pagination fails or cannot complete, stop before any
  create or update and ask for the exact Document public short ID. For multiple exact-title matches
  across any pages, ask the user to choose a public short ID before any write. Show public short
  IDs and ask when several matches are plausible. Use `get_document` for the full typed content.
- Use `search_knowledge` with the user's concrete business question. Summarize only the returned
  workspace excerpts, preserve useful source attribution and certainty, and say when nothing
  relevant was returned.
- Use `get_run` when the user supplies a run short ID or asks for a known evaluation result. Report
  its state; when complete, summarize the returned public result and include the run short ID.
- Reads may use only the workspace selected during authorization. Never ask for another workspace's
  internal identifier or imply that a read crossed that boundary.

## Save typed Documents safely

Call `create_document` or `update_document` only when the user clearly asked to save, create, move,
rename, or change a Document. A request to read, summarize, search, or inspect does not authorize a
write. Standalone Documents need no project; include `projectShortId` only when the user selected a
project.

Use the live advertised input schema and returned typed content as the authority for supported
fields. Preserve the supported content shape instead of flattening everything into a generic
message:

- `message`, `linkedin_dm`, `linkedin_post`, `social_post`, and `article` contain the exact `body`;
- `cold_email_sequence` contains ordered steps with `id`, `label`, optional `subject`, exact `body`,
  and optional `sendAfterDays`;
- `linkedin_sequence` contains ordered steps with `id`, `label`, exact `body`, and optional
  `sendAfterDays`.

For a new sequence, use ordered public step references `step-1`, `step-2`, and so on. For an update,
first read the Document and preserve each existing `step-N` reference for the step it identified;
use the next available reference for a newly added step. Preserve supported subjects, labels, and
timing unless the user explicitly changed them. Optional fields, including `recipientContext`, may
be sent only when supported by the live advertised input schema; preserve supported values from
returned typed content.

If the user supplies context that the live schema does not support, explicitly tell them it cannot
be saved in this Document. Never silently drop that context, claim it was saved, or fold it into the
exact `body` without explicit permission. Ask whether to save the supported draft without that
context or revise the body, and wait for their choice before writing.

For each distinct write, generate a new idempotency key. Reuse that same key only when retrying the
same intended write; never reuse it for a different change. Before `update_document`, call
`get_document` and pass its exact public short ID, revision, content hash, and update timestamp. If
the tool reports a stale conflict, read the Document again, explain what changed, and ask before
applying the requested edit to the newer revision. Never overwrite through a conflict or create a
duplicate to avoid it.

Report public short IDs and user-facing names. Never expose internal UUIDs, principle IDs, principle
numbers, raw prompts, provider data, tokens, authorization codes, client secrets, or callback URLs.
