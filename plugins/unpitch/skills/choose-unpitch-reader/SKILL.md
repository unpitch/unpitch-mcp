---
name: choose-unpitch-reader
description: List the Unpitch Personas available for an ICP Simulation and help the user choose one before any credits are spent.
---

# Choose an Unpitch reader

Use this workflow when the user wants to see who can react to their outreach or needs to choose a
Persona for a Simulation.

1. Call `list_personas` and keep paging until the list is complete or the user asks you to stop.
2. Show each Persona's user-facing name, role, short ID, and whether it is standard or supported by
   research evidence. Never display an internal UUID, prompt, principle ID, or principle number.
3. If the user already named one Persona and exactly one result matches, repeat its name and short ID
   so the selection is explicit. If several results are plausible, show those choices and ask the
   user to pick one. Never guess.
4. Do not quote or start a Simulation in this workflow. Listing and selecting a Persona spends no
   credits.
