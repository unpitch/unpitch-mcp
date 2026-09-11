# Troubleshooting

| Symptom                                                                   | What it means and what to do                                                                                                                                                       |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code says the server needs authentication, or a request returns 401 | Access was revoked in Settings, the authorisation was replaced from another machine, or your membership ended. Run `/mcp` and authorise again.                                    |
| The browser opened but nothing came back to Claude Code                    | Something else is listening on port 8080. Free the port and run `/mcp` again; the callback address is fixed to `http://localhost:8080/callback`.                                   |
| `update_document` returned a conflict                                     | The Document changed since Claude Code last read it. Read it again with `get_document` and retry against the current revision.                                                    |
| A run was refused because the organisation limit is reached               | The monthly Claude Code limit is shared by your organisation and resets on the first of the month (UTC). An owner or admin can raise it in Settings → Integrations.               |
| A quote expired                                                           | Quotes hold their price for five minutes. Ask for a new quote and confirm it.                                                                                                     |
| `get_run` still says the run is in progress                               | Quality Check and Simulation are asynchronous. Poll again; the result is the same one Unpitch shows once it is ready.                                                             |
| The `/mcp` list does not show `unpitch`                                   | The server was added in a different scope or directory. `claude mcp list` shows what is configured; re-run the install command in the scope you use.                              |

Still stuck? Check Settings → Integrations for the connection state and recent calls, then open an
issue in this repository with the symptom (never a token or a code).
