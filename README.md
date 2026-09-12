# Unpitch for Claude Code

Test your outreach in Claude Code. Draft with your company context, catch weak spots with Quality
Check, and simulate ICP reactions before you send. Documents and results stay in your Unpitch
workspace.

This repository documents the hosted Unpitch MCP server and ships a small Claude Code plugin. It
contains no server code and no secrets. The canonical setup guide is
<https://unpitch.ai/integrations/claude-code/getting-started>; this README mirrors it.

## Install

Run this in the terminal on the machine where you use Claude Code:

```sh
claude mcp add --transport http --client-id ae21983d-3072-43ab-ad47-d5feae975afc --callback-port 8080 unpitch https://api.unpitch.ai/mcp
```

`ae21983d-3072-43ab-ad47-d5feae975afc` is the one public client Unpitch registers for Claude Code. It is published on
the setup guide and in the setup dialog under Settings → Integrations. There is no client secret
and nothing to register yourself. The callback is fixed to `http://localhost:8080/callback`, which
is why the port is part of the command.

Sign-in requests the `email` scope. What each tool may do is declared by the tool, not by the
sign-in.

Prefer project scope? The command above with `--scope project` writes [`examples/mcp.json`](./examples/mcp.json).

## Authorise one workspace

Open Claude Code and run `/mcp`. Select `unpitch`, sign in to Unpitch in the browser that opens,
and choose the workspace Claude Code may use. The browser returns to Claude Code on its own.

One authorisation binds one workspace. To work in another workspace, authorise again and choose it;
the previous authorisation is replaced.

## Verify

Ask Claude to call `get_workspace_context` and report the workspace and available credits. It is a
read, so it proves the connection without spending anything. Settings → Integrations then shows the
connection as Connected.

Or paste this into Claude Code and let it run the whole sequence:

```text
Set up Unpitch for me.

1. Run: claude mcp add --transport http --client-id ae21983d-3072-43ab-ad47-d5feae975afc --callback-port 8080 unpitch https://api.unpitch.ai/mcp
2. Walk me through opening /mcp and authorising Unpitch in my browser, where I choose my workspace.
3. After I confirm, call get_workspace_context and report the returned workspace and available credits.
```

## What Claude Code can do

Claude Code reads context, writes Documents, and spends only on evaluation.

| Kind     | Tools                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| Read     | `get_workspace_context`, `list_documents`, `get_document`, `search_knowledge`, `list_personas`, `get_run`       |
| Write    | `create_document`, `update_document`                                                                            |
| Evaluate | `run_quality_check`, `quote_simulation`, `run_simulation`                                                       |

Reads and writes are free. Quality Check uses included capacity first and asks you to confirm a
five-minute quote when credits are needed. Simulation costs 10 credits per run, always through a
quote you confirm. Credits admitted through Claude Code count against one monthly limit shared by
your organisation (10,000 credits by default, set in Settings → Integrations).

Claude Code never writes the Knowledge Base or Personas, never reads another workspace, and never
sees internal identifiers or prompts. Full reference: [`docs/tools.md`](./docs/tools.md).
Permissions and revocation: [`docs/security.md`](./docs/security.md).

## The `/unpitch` commands

The plugin in this repository adds four commands. They are prompts over the tools above and add no
tool of their own.

| Command             | What it does                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `/unpitch:check`    | Saves the open draft as a Document (or updates it), runs a Quality Check, prints the verdict and link |
| `/unpitch:context`  | Which workspace is connected, what is included, what is left in the monthly limit                   |
| `/unpitch:readers`  | Lists the Personas you can simulate against, so you pick who reads before you spend                 |
| `/unpitch:simulate` | Quotes a Simulation, waits for your confirmation, runs it, prints the link                          |

This repository is a Claude Code marketplace. Add it once, then install the plugin:

```sh
claude plugin marketplace add unpitch/unpitch-mcp
claude plugin install unpitch@unpitch
```

The plugin declares no MCP server, so the `claude mcp add` step above still connects Claude Code to
Unpitch; the plugin only adds the commands. Without it, the four prompts in
[`commands/`](./commands) can be copied into your own `.claude/commands/`.

## Revoke

Settings → Integrations → Revoke access denies the next request from Claude Code. Your local
configuration stays, so you can authorise again later. To remove the server from Claude Code:

```sh
claude mcp remove unpitch
```

## Supported client

Claude Code is the supported client. Unpitch speaks the standard MCP streamable HTTP transport with
OAuth, so other clients may connect, but only the Claude Code path is tested and documented.

Troubleshooting: [`docs/troubleshooting.md`](./docs/troubleshooting.md). Changes:
[`CHANGELOG.md`](./CHANGELOG.md).
