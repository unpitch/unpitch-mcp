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

This package's machine identity is `unpitch-hosted`; supported clients show **Unpitch**. Claude
Desktop sign-in and ten of the eleven tools have been tested in the real app. A paid Simulation
run and ChatGPT Desktop account connection still await end-to-end verification.

The public plugin package is licensed under MIT. Unpitch account access and hosted evaluations are
covered by the [Unpitch terms](https://unpitch.ai/terms) and
[privacy policy](https://unpitch.ai/privacy).
