# Changelog

## 0.3.1

- Fix automatic ChatGPT sign-in requesting unsupported OpenID, profile, and phone scopes.
- Declare OpenAI OAuth in the portable MCP configuration with email and session renewal only,
  explicit DCR, the exact MCP resource, and disabled OIDC defaults.
- Preserve all eleven commands, six skills, Claude transports, and the manual Claude Code identity.
- Validate the closed OAuth policy and reject missing overrides or broader identity permissions.

## 0.3.0

- Ship eleven commands in both plugin variants, with one primary operation for each MCP tool.
- Add document browsing, reading, creation, revision, Knowledge Base search, result retrieval,
  and a Simulation quote command that cannot spend credits.
- Keep the existing four commands, six skills, and Claude Code connection identity.
- Validate command inventory, tool permissions, and mirrored package content; reject missing
  commands and write or spend permissions added to read or quote workflows.
- Correct verification status: the Claude demo account exercised all eleven MCP tools; native
  ChatGPT connection remains pending, and Claude's official listing awaits review.

## 0.2.3

- License the public plugin repository under MIT.
- Add documentation, support, privacy, and terms links for Claude directory listings.
- Use a static Unpitch logomark that the directory can render.
- Update the documented Claude Code installation and update verification status.

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
