# Agent Instructions

Instructions for AI coding agents (Claude, Gemini, Copilot, etc.) working in this repository.

## i18n / translations

- Only write or edit strings in [app/i18n/en.json](app/i18n/en.json).
- Never hand-edit any other locale file under `app/i18n/`. All other languages are synced from Transifex and will be overwritten.

## Linting & formatting

- Run `pnpm lint` to check formatting and linting before considering a change complete.
