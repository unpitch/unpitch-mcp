# Changelog

## 0.2.2

- Package the current Unpitch logomark for Claude listings and ChatGPT logo/composer metadata.

## 0.2.1

- Align assistant-specific descriptions with the Unpitch outreach positioning.

## 0.2.0

- Added a portable Agent Plugins manifest, hosted MCP definition, OpenAI marketplace catalog, and
  reusable skills for setup, context, reader selection, Quality Check, and Simulation.
- Added a DCR-only `unpitch-hosted` package for hosted clients while preserving the shipped
  `unpitch@unpitch` Claude Code identity, manual server name, public client ID, and localhost
  callback.
- Kept the four `/unpitch` command workflows on the existing manual `mcp__unpitch` tools and added
  validation that prevents either plugin variant or its tool allowlists from drifting.
- Documented the server-side DCR release gate and the separate account-connection step.

## 0.1.0

- Initial public documentation for the hosted Unpitch MCP server: install, authorisation, tool
  reference, permissions and troubleshooting.
- Claude Code plugin with `/unpitch:check`, `/unpitch:context`, `/unpitch:readers` and
  `/unpitch:simulate`.
