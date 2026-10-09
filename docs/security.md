# Permissions and security

## How access is granted

- **Hosted plugin clients use DCR.** The `unpitch-hosted` package contains only the HTTPS MCP URL.
  Claude and ChatGPT discover the authorization server and dynamically register their own OAuth
  clients. It never gives a hosted client the Claude Code public client ID.
- **Claude Code keeps its manual public-client connection.** The `unpitch@unpitch` package declares
  the workflows but no MCP server. Its commands use the separately configured manual server named
  `unpitch`, with the existing public client ID, PKCE, and fixed
  `http://localhost:8080/callback`. There is no client secret.
- **Install and connection are separate.** Installing either plugin does not prove an account is
  connected. A successful `get_workspace_context` call after sign-in does.
- **Identity-only sign-in.** Sign-in requests the `email` scope. What each tool may do is declared
  by the tool, not by the sign-in.
- **One workspace per authorisation.** On the consent screen you choose exactly one workspace.
  Authorising again replaces the previous authorisation.
- **Membership follows you.** If you leave the organisation, the authorisation ends with your
  membership.

## What the server will and will not do

Claude Code reads context, writes Documents, and spends only on evaluation.

- Reads are scoped to the authorised workspace: its slug, Knowledge Base excerpts with sources,
  Personas, Documents and run results.
- Writes are limited to Documents, and every write is revision-checked.
- Evaluation spends credits only after you confirm a quote in Claude Code, and Simulation is never
  started without one.
- The server never writes the Knowledge Base or Personas, never reads another workspace, and never
  exposes internal prompts or raw provider data. Plugin workflows also omit internal principle IDs
  and principle numbers from user-facing results.

## Spend limits

Credits admitted through the integration count against one monthly limit shared by everyone in your
organisation. The default is 10,000 credits per calendar month (UTC). Owners and admins can change
it in Settings → Integrations. Lowering it below what the organisation already admitted this month
leaves no room until the reset.

## Audit and revocation

Settings → Integrations lists the calls this connection made that created or changed something,
each linking to the Document or run it touched. Revoke access there; the next request from the
connected client is denied. The installed plugin remains in the client, so you can authorise again
later.

## Reporting a problem

Open an issue in this repository for documentation problems. For anything involving your account or
data, contact Unpitch support from the app rather than posting details publicly.
