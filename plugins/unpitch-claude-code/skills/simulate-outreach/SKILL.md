---
name: simulate-outreach
description: Quote and run an Unpitch ICP Simulation for one exact Document revision and Persona version. Use when the user asks how a target reader or Persona would react to outreach.
---

# Simulate outreach with Unpitch

The user writes and revises in this assistant. Unpitch evaluates the exact saved Document revision;
it does not author the draft. Never rewrite the draft unless the user explicitly asks.

## Resolve exact inputs

1. Resolve the Document. If the user supplied a short ID, call `get_document`. Otherwise call
   `list_documents` and show plausible matches with their short IDs. Use an exact-title match only
   when the user's intent is unambiguous. With multiple matches, ask. Never guess or silently create
   a duplicate.
2. If the user supplied unsaved draft text and explicitly asks to simulate it, first follow the
   Document resolution and revision-safe save rules from the `check-outreach` workflow, but do not
   run a Quality Check unless requested.
3. Resolve the Persona with `list_personas`. Keep paging as needed. Repeat the selected Persona's
   user-facing name and short ID. If multiple Personas are plausible, ask the user to choose.
4. Call `get_document` immediately before quoting so you hold its current short ID, revision,
   content hash, and update timestamp. Use the selected Persona's current version timestamp from
   `list_personas`.

## Quote, confirm, and run

5. Call `quote_simulation` with a new idempotency key and the exact Document revision, content hash,
   Persona short ID, and Persona version timestamp.
6. Show the exact credit amount, quote expiry, room left in the monthly limit, Document title and
   revision, and Persona name. Ask: “This quote will spend **<amount> credits** to simulate
   **<title>**, revision **<revision>**, with **<Persona>**. Do you approve this quoted spend?”
7. Wait for an explicit yes tied to that displayed quote. Do not infer approval from the original
   request, an earlier quote, or a general preference. One confirmation authorizes one Simulation.
8. After approval, call `run_simulation` once with the quote reference and the same Document and
   Persona identities. If the quote expired or either version changed, get a fresh quote and ask
   again.
9. Poll `get_run` at reasonable intervals until the run succeeds, fails, or needs user action. On
   success, summarize the returned reaction and include the returned run short ID.

Use only user-facing Persona, finding, and principle names. Never display internal UUIDs, principle
IDs, principle numbers, raw prompts, or provider data. Do not present a rewritten draft unless the
user separately asks for one.
