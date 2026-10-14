# Troubleshooting

| Symptom                                                                   | What it means and what to do                                                                                                                                                       |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude shows Unpitch as not connected                                      | Open the plugin's **Connectors** tab or MCP connection settings, sign in, and choose one workspace. A free `get_workspace_context` response proves the connection.                |
| ChatGPT shows Unpitch as not connected after installation                  | Complete the sign-in window that opens during installation and choose one workspace. If sign-in fails, use only recovery controls shown on the plugin screen. A free `get_workspace_context` response proves the connection. |
| A hosted client cannot start OAuth                                         | Confirm the DCR release gate in `docs/maintainer-release.md` has been cleared. The main plugin must not be released before server-side DCR is deployed and verified.                 |
| Claude Code says the server needs authentication, or a request returns 401 | Access was revoked, the authorisation was replaced from another machine, or your membership ended. Run `/mcp` and authorise again.                                                |
| The browser opened but nothing came back to Claude Code                    | Something else is listening on port 8080. Free the port and run `/mcp` again; the callback address is fixed to `http://localhost:8080/callback`.                                   |
| `update_document` returned a conflict                                     | The Document changed since Claude Code last read it. Read it again with `get_document` and retry against the current revision.                                                    |
| A run was refused because the organisation limit is reached               | The monthly integration limit is shared by your organisation and resets on the first of the month (UTC). An owner or admin can raise it in Settings → Integrations.              |
| A quote expired                                                           | Quotes hold their price for five minutes. Ask for a new quote and confirm it.                                                                                                     |
| `get_run` still says the run is in progress                               | Quality Check and Simulation are asynchronous. Poll again; the result is the same one Unpitch shows once it is ready.                                                             |
| The `/mcp` list does not show `unpitch`                                   | Open Settings → Integrations, choose Set up beside Claude Code, and paste the setup instructions into Claude Code to finish the connection.                                      |

Still stuck? Check Settings → Integrations for the connection state and recent calls, then open an
issue in this repository with the symptom (never a token or a code).
