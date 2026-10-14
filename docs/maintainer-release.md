# Maintainer release gate

The `unpitch-hosted` package, displayed to users as **Unpitch**, is intentionally DCR-only. Do not
publish, sync, or announce it as a working hosted connection until Unpitch's authorization server
supports Dynamic Client Registration for the hosted clients that will install it. The package
source can be published before that rollout with hosted sign-in clearly marked as unavailable.
Schema validation alone does not prove sign-in works.

## Current verification status — 14 October 2026

Production discovery advertises Dynamic Client Registration. Claude Desktop sign-in completed
through the GitHub marketplace, and the native connector exposes eleven MCP tools. A separate
synthetic review workspace exercised all eleven tools through Claude, including an explicitly
approved 40-credit Simulation. The owner connection was restored and verified afterward.
Document creation replay reused the same Document, a stale update returned a conflict, and an
included Quality Check completed without spending credits.

Claude Code installation, update to 0.2.2, and a fresh-session workspace read passed while
preserving the manual connection and public client identity. Version 0.3.0 adds seven commands
for eleven total in each package; package checks do not establish native execution of every command.

ChatGPT native install, account connection, and a real tool response remain unverified. Its
website's personal Plugins menu did not expose Add a marketplace when checked. Follow current
OpenAI documentation and inspect the actual client's UI instead of treating that older observation
as a restriction on all ChatGPT surfaces.

Claude's official directory submission for version 0.2.3 passed its security scan and awaits an
Anthropic reviewer; Publish was requested. It is not live. A source release and a directory
publication are separate states. OpenAI's official submission is a separate application through
its Platform Plugins portal; uploading a package creates a draft, not a published listing.

## Backend dependency

Verify the production authorization metadata used by `https://api.unpitch.ai/mcp`:

- protected-resource and authorization-server discovery complete without a manual client ID;
- the authorization-server metadata advertises a `registration_endpoint`;
- PKCE with `S256` is advertised and enforced;
- DCR accepts the redirect URIs supplied by supported Claude and ChatGPT clients;
- dynamically registered clients cannot reuse the Claude Code public client registration;
- a consent grant binds exactly one Unpitch workspace and requests only the intended identity
  scope.

Do not widen the registered redirect URIs of the existing Claude Code client to make hosted clients
work. That client remains limited to `http://localhost:8080/callback` and is configured by the
documented manual `claude mcp add` command.

## Claude Code compatibility gate

The shipped Code identity remains `unpitch@unpitch`, and its commands use the manual server named
`unpitch`. The package must not add a `.mcp.json` or claim a plugin-scoped server until a clean
install and an update from the shipped package have both been tested with real authorization. A
future native connection must preserve existing manual connections or include a verified migration;
schema validation is not evidence for that path.

## Package checks

From the marketplace root, run:

```sh
node scripts/validate-package.mjs
claude plugin validate --strict .
claude plugin validate --strict ./plugins/unpitch
claude plugin validate --strict ./plugins/unpitch-claude-code
```

Build secondary upload archives only after those checks pass:

```sh
node scripts/build-archives.mjs
```

## End-to-end checks after rollout

Use accounts with no prior Unpitch connector or cached authorization for the hosted checks. The
Claude Code compatibility check additionally needs one client with the shipped setup.

1. In Claude, follow **Customize > Plugins > Add > Add marketplace**, choose
   **Add from a repository**, paste the repository URL, select **Sync**, install **Unpitch**, and
   confirm the plugin is installed but the account is not represented as connected before OAuth.
2. In ChatGPT Desktop, follow **Plugins > Add > Add a marketplace**, install **Unpitch**, and make the same
   install-versus-connect check. Follow the prompts and supply the copied marketplace link when
   ChatGPT requests it rather than assuming an unverified field label.
3. On each hosted client, connect Unpitch, choose one workspace, and call
   `get_workspace_context`. Record the client version and the workspace returned.
4. Create a Document, update its exact revision, and force a stale-revision conflict to verify that
   newer content is not overwritten.
5. Run an included Quality Check. Then test a quoted Quality Check and confirm that no spend occurs
   before the displayed quote is explicitly approved.
6. Quote and run one Simulation. Confirm that one approval creates one run and that the result uses
   user-facing finding names without internal principle IDs or numbers.
7. On a client with the shipped `unpitch@unpitch` plugin and manual `unpitch` server, sync this
   marketplace and update `unpitch@unpitch`. Verify all eleven `/unpitch` commands still use that
   server. On a clean client, run the documented marketplace, plugin, and `claude mcp add` commands.
   In both cases, run `/mcp`, select `unpitch`, and verify the existing public client returns to
   `http://localhost:8080/callback` without a client secret.

Only after these checks pass should the README's hosted installation paths be treated as verified.
