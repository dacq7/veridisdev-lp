# Codebase Audit (pre-v2)

These six documents are the output of the Codebase Archaeologist agent, executed at the start of the v2 project on 2026-05-10. They describe the state of the v1 codebase before any v2 work began. Every finding cites a specific file and line number as evidence.

## Files

- **REPO-INVENTORY.md** — file counts, LOC, dependencies, rough age estimates
- **ARCHITECTURE-CURRENT.md** — stack identified, data flow, routing patterns
- **STRENGTHS.md** — what was already well done and preserved in v2
- **WEAKNESSES.md** — technical debt, anti-patterns, security gaps (all [HIGH] and [MEDIUM] resolved in v2)
- **PATTERNS-EXTRACTED.md** — reusable patterns identified for v2
- **PROMOTABLE-ASSETS.md** — components extractable to a shared library

## How v2 used these findings

Every `[HIGH]` and `[MEDIUM]` finding in `WEAKNESSES.md` is addressed by a specific commit on the `v2` branch. Search the commit history for `"Closes [HIGH]"` or `"Closes [MEDIUM]"` to trace the resolution of each issue.

## Context

This audit was produced before Sprint 1 began. The purpose was to avoid greenfield assumptions — the v2 architect needed to know exactly what existed in the codebase, what was worth preserving, and what needed replacing.
