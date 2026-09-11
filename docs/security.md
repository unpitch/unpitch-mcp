# Permissions and security

## How access is granted

- **One public client.** Claude Code signs in with a pre-registered public client ID and PKCE.
  There is no client secret and no registration step of your own. Dynamic client registration is
  not offered.
- **Fixed callback.** The browser returns to `http://localhost:8080/callback`, which is why the
  install command pins `--callback-port 8080`.
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
  exposes internal identifiers, prompts or raw provider data.

## Spend limits

Credits admitted through Claude Code count against one monthly limit shared by everyone in your
organisation. The default is 10,000 credits per calendar month (UTC). Owners and admins can change
it in Settings → Integrations. Lowering it below what the organisation already admitted this month
leaves no room until the reset.

## Audit and revocation

Settings → Integrations lists the calls this connection made that created or changed something,
each linking to the Document or run it touched. Revoke access there; the next request from Claude
Code is denied. Nothing on your machine is changed by revoking, so you can authorise again later.

## Reporting a problem

Open an issue in this repository for documentation problems. For anything involving your account or
data, contact Unpitch support from the app rather than posting details publicly.
