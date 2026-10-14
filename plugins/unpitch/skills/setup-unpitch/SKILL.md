---
name: setup-unpitch
description: Verify the connected Unpitch workspace without spending credits. Use after installing the plugin or completing account sign-in.
---

# Set up Unpitch

Account sign-in belongs to the client's native connection flow. This skill checks the result;
it cannot install a connector or create account access. Installing a plugin does not prove a
connection.

If `get_workspace_context` is available, call it once. On success, say "Connected to [workspace]."
Use the returned workspace name. Give credit balances, capacity, organisation and reset details
only if the user asks for them. Do not call writes, evaluations, or any other tool during this check.

If the tool is missing in ChatGPT or Codex, immediately say: "Unpitch's tools aren't available in
this chat, so I can't verify the connection yet." Stop. Missing tools do not prove an expired login;
the plugin or client may have failed to load the connection. Do not investigate the client's screen,
use computer control, invoke plugin-management, search files or settings, research documentation,
run shell commands, or ask the user to describe buttons. Do not send the user back to this setup
conversation or recommend reinstalling. Do not announce an investigation before this short result.

If an available tool returns an authorization error, let the client handle its native sign-in
prompt. If it supplies a sign-in action, ask the user to complete that action and choose a workspace.
If no action is supplied, report the returned error and stop; do not invent a Connect button,
Connectors tab, sign-in link, or other recovery control. Retry the workspace read at most once,
only after the user confirms sign-in completed. Stop if that read fails.

For Claude, the known account connection lives in the plugin's **Connectors** tab or MCP settings.
For Claude Code, the manual server is named `unpitch`: use `/mcp` for its account sign-in. If that
server is not configured, guide the user to Unpitch's **Settings > Integrations**, **Set up** for
Claude Code. Those instructions install from the marketplace and prepare or reuse the
existing `unpitch` server. Do not offer a ZIP or raw command as
an alternative setup path.

Never ask for a token, authorization code, client secret or browser callback URL in the conversation.
Never claim the account is connected until `get_workspace_context` succeeds. One authorization grants
access to one workspace; changing it requires native sign-in and choosing the new workspace.
