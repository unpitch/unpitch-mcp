# Unpitch

**Make Claude and ChatGPT better at outreach.**

Catch AI slop and weak spots in your messages. Test drafts with personas modeled on your ideal
buyers, then use the feedback to improve your outreach in the same conversation.

Unpitch saves and evaluates the draft you choose. Your assistant revises it with you when you ask.
It never spends quoted credits without explicit approval.

This package uses Dynamic Client Registration. Installing it adds the plugin and connector
definition; it does not prove that an Unpitch account is connected. Connect Unpitch from the
plugin's connector settings, sign in, choose one workspace, and verify with
`get_workspace_context` before using a write or evaluation tool.

This package's machine identity is `unpitch-hosted`; supported clients show **Unpitch**. The
server-side DCR release gate in the marketplace repository must be cleared before this package is
published for hosted clients.
