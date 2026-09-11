# Tool reference

Eleven tools, all scoped to the one workspace you authorised. Names are stable; inputs are strict
(unknown fields are rejected) and outputs are typed. Short IDs are the public identifiers you see
in Unpitch URLs.

## Read

| Tool                    | Input                                        | Returns                                                                                              | Cost |
| ----------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---- |
| `get_workspace_context` | none                                         | Workspace and organisation slugs, available evaluation capacity and credits, room left in the monthly Claude Code limit and when it resets | Free |
| `list_documents`        | optional cursor and page size                | A bounded page of Documents with title, type and the revision identity each later read or edit must name | Free |
| `get_document`          | Document short ID                            | One Document with its typed content and current revision                                             | Free |
| `search_knowledge`      | a question                                   | A small set of workspace-scoped Knowledge Base excerpts, each with its source                        | Free |
| `list_personas`         | optional cursor and page size                | Personas eligible for Simulation, marked standard or researched                                      | Free |
| `get_run`               | run short ID                                 | The public result of one Quality Check or Simulation once complete, or its current state             | Free |

## Write

| Tool              | Input                                                  | Returns                                                                 | Cost |
| ----------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- | ---- |
| `create_document` | type, title, typed content, request ID                 | The new Document's short ID and revision                                | Free |
| `update_document` | short ID, expected revision, changes, request ID       | The new revision, or a conflict if the Document changed since your read | Free |

Every write names a request ID so a retry never creates a duplicate. `update_document` is
revision-checked: a stale revision returns a conflict instead of overwriting newer work. Read the
Document again and retry against the current revision.

## Evaluate

| Tool                | Input                                                  | Returns                                                                                         | Cost                                                                          |
| ------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `run_quality_check` | Document short ID, exact revision, request ID          | A run short ID to poll with `get_run`, or a five-minute quote to confirm when credits are needed | Included capacity first; credits only after a confirmed quote                 |
| `quote_simulation`  | Document short ID and revision, Persona and version    | A five-minute quote with the price and the room left in the monthly limit; nothing is spent     | Free                                                                          |
| `run_simulation`    | the quote, request ID                                  | A run short ID to poll with `get_run`                                                           | 10 credits per run                                                            |

Runs are asynchronous. Poll `get_run` until the result is ready, then open the link it returns in
Unpitch. Results are the same ones the app shows.

## What is not here

There is no tool that writes the Knowledge Base, creates or edits Personas, reads another
workspace, or exports data. That is by design: the Knowledge Base and Personas are what every
evaluation is scored against, and an agent that could change them could move the ground under its
own results.
