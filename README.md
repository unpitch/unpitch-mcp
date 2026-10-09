# Unpitch plugin marketplace

Write or revise outreach in your assistant, then use Unpitch to save the exact draft, run a Quality
Check, or simulate how a chosen ICP Persona reacts. The packaged workflows do not rewrite your copy
unless you ask. Any evaluation that needs credits shows the quote and waits for your explicit
approval before spending.

> **Connection verification pending:** the marketplace package is available, but hosted sign-in
> requires Unpitch's server-side Dynamic Client Registration rollout. The live server does not
> support it yet. Complete [`docs/maintainer-release.md`](./docs/maintainer-release.md) before
> enabling or announcing the hosted connection for customers.

Installing a plugin and connecting an Unpitch account are separate steps. Both packages add the
workflows; the hosted package also adds a connector definition, while Claude Code prepares or
reuses its existing connection through the setup instructions. You still sign in to Unpitch and choose one workspace before the
assistant can use its tools.

## Add to Claude

After the release gate is cleared:

1. Open **Customize > Plugins**.
2. Select **Add > Add marketplace**.
3. Select **Add from a repository**, paste `https://github.com/unpitch/unpitch-mcp` in the URL
   field, then select **Sync**.
4. Add **Unpitch**.
5. Open the plugin's **Connectors** tab, add or connect Unpitch, sign in, and choose the workspace it
   may use.
6. Ask: “Show my Unpitch workspace and available credits.” A successful
   `get_workspace_context` response proves the account connection without spending credits.

## Add to ChatGPT

After the release gate is cleared:

1. Open **Plugins**.
2. Select **Add > Add a marketplace**.
3. Follow ChatGPT's prompts and paste `https://github.com/unpitch/unpitch-mcp` when it asks for the
   marketplace link.
4. Add **Unpitch**.
5. Open its connector settings, connect Unpitch, sign in, and choose the workspace it may use.
6. Ask: “Show my Unpitch workspace and available credits.” Do not treat installation alone as proof
   that the account is connected.

## Add to Claude Code

1. Open **Settings > Integrations** in Unpitch and choose **Set up** beside Claude Code.
2. Copy the setup instructions and paste them into Claude Code. It installs Unpitch from this
   marketplace and prepares or reuses your existing connection.
3. Follow the sign-in prompt, choose your workspace, then return to Claude Code. Ask it to show the
   connected workspace and available credits.

Existing users keep the `unpitch@unpitch` plugin, the same connection, and the four `/unpitch`
commands when the marketplace updates. The setup instructions handle connection details; you do
not need to enter an API key or client secret.

## What you can ask

- “Check this outreach draft with Unpitch.”
- “Show me the Personas I can simulate against.”
- “Simulate this exact draft against the CFO Persona.”
- “Show my Unpitch workspace, included capacity, credits, and monthly room.”

The workflow resolves the exact Document short ID and revision before an update or evaluation. If a
title matches more than one Document, it asks you to choose rather than guessing. Results use
user-facing finding names and omit internal principle identifiers and numbers.

Reads and Document writes are free. Quality Check uses included capacity first and returns a quote
when credits are needed. Simulation returns a quote before a run. A quoted spend is valid only after
you explicitly approve that displayed quote, and one confirmation authorizes one run.

Tool details: [`docs/tools.md`](./docs/tools.md). Permissions and OAuth separation:
[`docs/security.md`](./docs/security.md). Troubleshooting:
[`docs/troubleshooting.md`](./docs/troubleshooting.md).

## Package layout and validation

- `plugins/unpitch/` is the portable, DCR-only `unpitch-hosted` package for hosted Claude, ChatGPT,
  and compatible plugin hosts. Its display name is **Unpitch**.
- `plugins/unpitch-claude-code/` contains the Claude Code-only package installed as
  `unpitch@unpitch` and used with the manual `unpitch` MCP connection.
- `.claude-plugin/marketplace.json` is the Claude marketplace catalog.
- `.agents/plugins/marketplace.json` is the OpenAI marketplace catalog and exposes only the hosted-safe
  plugin.

Run `node scripts/validate-package.mjs` for local structural checks and
`claude plugin validate --strict .` for Claude's authoritative manifest validation. Run
`node scripts/build-archives.mjs` to build the ZIP used by publisher tooling and public-directory
submission after validation. Customer setup uses the marketplace.
