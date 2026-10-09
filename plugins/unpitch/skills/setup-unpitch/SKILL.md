---
name: setup-unpitch
description: Connect an Unpitch account and verify the selected workspace without spending credits. Use after installing the plugin or when Unpitch tools report an authorization error.
---

# Set up Unpitch

Use this workflow to verify the connection. Installing either package adds workflows. The hosted
package also supplies connector metadata; Claude Code uses the separately configured manual server
named `unpitch`. Neither installation proves that the user's Unpitch account is connected.

1. If the Unpitch tools are available, call `get_workspace_context` once. Do not call a write or
   evaluation tool during setup.
2. If the call succeeds, report the workspace and organisation, included evaluation capacity,
   available credits, monthly room, and reset time. Say that this successful read verifies the
   connection.
3. If the tool is unavailable, returns an authorization error, or cannot start sign-in, direct a
   hosted user to this plugin's **Connectors** tab or MCP connection settings. In Claude Code, have
   the user open **Settings > Integrations** in Unpitch, choose **Set up**, and paste those setup
   instructions into Claude Code. They install from the marketplace and prepare or reuse the
   existing `unpitch` server. Then have the user open `/mcp`, sign in, and choose one workspace.
   Wait until they say that step is complete before retrying. Do not offer a ZIP or raw command as
   an alternative setup path.
4. Never ask the user to paste a token, authorization code, client secret, or browser callback URL
   into the conversation.
5. Never claim the account is connected until `get_workspace_context` succeeds. If it still fails,
   report the error plainly and stop rather than retrying in a loop.

One authorization grants access to one workspace. Changing the workspace requires authorizing
again and choosing the new workspace.
