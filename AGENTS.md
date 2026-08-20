# Agent Instructions

Instructions for AI coding agents (Claude, Gemini, Copilot, etc.) working in this repository.

## i18n / translations

- Only write or edit strings in [app/i18n/en.json](app/i18n/en.json).
- Never hand-edit any other locale file under `app/i18n/`. All other languages are synced from Transifex and will be overwritten.

## Linting & formatting

- Run `pnpm lint` to check formatting and linting before considering a change complete.

## Design constraints

1. Match our current design system — before proposing anything, look at
   [component library / existing pages / design tokens file] and extract
   the actual patterns in use: color palette, type scale, spacing units,
   border-radius, shadow style, component conventions (buttons, forms,
   cards, etc.)
2. Default to consistency. Only diverge from an existing pattern if you
   have a concrete reason (e.g. the existing pattern doesn't support this
   interaction, or it would look broken in this context) — and if you do
   diverge, call it out explicitly and explain why, rather than silently
   introducing a new style.
3. Design for both breakpoints from the start, not mobile as an
   afterthought: show me how it behaves at desktop width and at mobile
   width, and flag any part of the interaction that needs to change
   shape (not just scale) between the two.

## Comments

- Do not duplicate documentation.
- Simplify the comments. Focus on the essence, no long prose.
- If code is self-evident, write no comment. A comment that restates what the code plainly does is
  a second copy to keep in sync, for no gain.

## Commit messages

- If the changed code already carries a docstring or comment explaining it, keep the commit message
  short. Anyone who needs details reads the changed lines, where the reasoning already is.
- Add a commit body only for reasoning that exists nowhere in the diff.
