# Specification

## Summary
**Goal:** Add additional template variants for Follow-up, Thank You, and Complaint/Feedback emails, while keeping the existing templates as the default outputs and improving “Generate alternative” to use the new variants.

**Planned changes:**
- Add the user-provided Follow-up, Thank You, and Complaint/Feedback drafts as additional template variants (without replacing or overwriting the current default templates for those email types).
- Update the existing “Generate alternative” refinement so that for Follow-up, Thank You, and Complaint/Feedback it can return an alternative draft by selecting one of the added variants (when available), while preserving current behavior for email types without variants.
- Ensure the new variants preserve the user-provided structure, including subject lines and placeholders (e.g., “Subject: Following Up - [Original Topic]”, “Subject: Thank You - [Reason]”, “Subject: Feedback Regarding [Issue]”).

**User-visible outcome:** Users still get the same default Follow-up/Thank You/Complaint draft after completing the question flow, but can use “Generate alternative” to receive a different draft based on the newly added variants (when available), with no changes to email type detection/triggers.
