---
name: check-outreach
description: Save the user's current outreach draft as an exact Unpitch Document revision and run a Quality Check. Use when the user asks Unpitch to check, score, critique, or test outreach copy.
---

# Check outreach with Unpitch

The user writes and revises in this assistant. Unpitch stores and evaluates the exact version the
user chooses. Treat the current conversation text or selected file as the source of truth. Never
rewrite the draft unless the user explicitly asks.

## Resolve the draft and Document

1. Identify the exact draft text, title, and Document type from the user's request and current
   context. If more than one block could be the draft, ask which one before calling a write tool.
2. Call `get_workspace_context` and tell the user whether the Quality Check is included now or may
   require credits.
3. If the user supplied a Document short ID, call `get_document` for it. Otherwise call
   `list_documents`. Follow every returned `nextCursor` unchanged as `cursor` in `list_documents`
   until `nextCursor` is `null`, collecting exact-title matches across all pages. Do not conclude no
   exact match or one exact match before pagination completes. If pagination fails or cannot
   complete, stop before any create or update and ask for the exact Document public short ID. For
   multiple exact-title matches across any pages, ask the user to choose a public short ID before
   any write. After pagination completes:
   - with no exact match, create a Document with `create_document` and a new idempotency key;
   - with one exact match, update it only when the user clearly said this is an update; otherwise
     show its title and short ID and ask;
   - with multiple plausible matches, show their titles and short IDs and ask the user to choose.
4. Before any update, call `get_document` and use that exact response's short ID, revision, content
   hash, and update timestamp with `update_document`. If the update conflicts, read the Document
   again, explain that it changed, and ask before applying the user's draft over the newer content.
   Never bypass revision checks and never create a duplicate to avoid resolving a conflict.

## Run and report the Quality Check

5. Call `run_quality_check` for the exact Document short ID, revision, and content hash you just
   created or updated. Use a new idempotency key.
6. If included capacity starts the run, continue. If the tool returns a quote, show the exact credit
   amount, quote expiry, and room left in the monthly limit. Ask: “This quote will spend **<amount>
   credits** on a Quality Check of **<title>**, revision **<revision>**. Do you approve this quoted
   spend?” Wait for an explicit yes tied to that displayed quote. Do not infer approval from the
   original request, an earlier quote, or a general preference. One confirmation authorizes one run.
7. After approval, call `run_quality_check` once with that quote reference and the same Document
   identity. If the quote expired or the Document changed, get a fresh quote and ask again.
8. Poll `get_run` at reasonable intervals until the run succeeds, fails, or needs user action. On
   success, report the returned verdict and findings in order, then include the returned run short
   ID.

Use only user-facing finding and principle names. Never display internal principle IDs, principle
numbers, raw prompts, or provider data. Do not turn the findings into a rewritten draft unless the
user separately asks you to revise it.
