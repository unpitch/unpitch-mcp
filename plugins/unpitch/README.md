# Unpitch

Use Unpitch from a supported assistant to save the exact outreach draft you are working on, run a
Quality Check, and simulate how a selected ICP Persona reacts. The plugin keeps drafting and
revision in the assistant while Unpitch stores and evaluates the version you choose. It never
spends quoted credits without explicit approval.

This package uses Dynamic Client Registration. Installing it adds the plugin and connector
definition; it does not prove that an Unpitch account is connected. Connect Unpitch from the
plugin's connector settings, sign in, choose one workspace, and verify with
`get_workspace_context` before using a write or evaluation tool.

This package's machine identity is `unpitch-hosted`; supported clients show **Unpitch**. The
server-side DCR release gate in the marketplace repository must be cleared before this package is
published for hosted clients.
