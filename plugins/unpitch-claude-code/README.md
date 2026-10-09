# Unpitch for Claude Code

Install Unpitch from the marketplace and let Claude Code complete the connection setup:

1. Open **Settings > Integrations** in Unpitch and choose **Set up** beside Claude Code.
2. Copy the setup instructions and paste them into Claude Code.
3. Follow the sign-in prompt, choose your workspace, and ask Claude to confirm the connection.

This package preserves the shipped `unpitch@unpitch` identity and the four `/unpitch` commands.
The setup instructions reuse the existing `unpitch` connection when it is already configured.
The package declares no second MCP server, so an update does not replace or duplicate that
connection. You do not need to enter an API key or client secret.

Use the main **Unpitch** package for hosted Claude and ChatGPT. Hosted account connection remains
subject to the server release and native verification described in the marketplace repository.
