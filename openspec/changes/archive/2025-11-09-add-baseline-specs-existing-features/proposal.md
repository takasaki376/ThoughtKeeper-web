# Change Proposal: add-baseline-specs-existing-features

## Summary
- Establish baseline specifications for existing functionality: Auth, Themes, Settings, and Memos.
- Capture current API behaviors and user flows so future changes can be proposed against a grounded spec.

## Motivation
- The repository lacks canonical specs under `openspec/specs`. Defining a baseline enables safer iteration, clear acceptance criteria, and automated validation via OpenSpec.

## Scope
- In scope: current server routes under `src/app/api/**`, authenticated layout/flows, and key pages/hooks driving the UX (Theme selection, Memo editing/listing, Settings, Password reset flows).
- Out of scope: DB schema migrations, performance optimizations, and new features beyond what is observable in code.

## Risks / Constraints
- Some UI copy is localized (JP) and partially garbled in diffs due to encoding; specs will describe behavior in English and avoid brittle text assertions.
- Auth is Supabase-driven; specs avoid leaking secrets and only define observable HTTP and navigation behavior.

## Validation
- `openspec validate add-baseline-specs-existing-features --strict` should pass.

## Notes
- After approval and implementation (spec sync), the deltas can be merged into `openspec/specs/<capability>/spec.md` via the OpenSpec archive/merge workflow.

