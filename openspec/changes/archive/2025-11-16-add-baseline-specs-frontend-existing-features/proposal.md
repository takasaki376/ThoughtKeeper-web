## Why

- Establish a baseline spec for existing frontend features so we can validate current behavior, prevent regressions, and enable spec-driven iteration.
- Unify scattered implicit requirements into a single change for review and approval.

## What Changes

- Add delta spec under `specs/frontend/spec.md` describing ADDED requirements for current UI flows:
  - App shell providers and header navigation
  - Home navigation shortcuts
  - Theme selection UI and start flow
  - Memo editor (tabs, inputs, countdown, auto-save)
  - Memo list rendering
  - Settings and theme switching
  - Authentication entry points and callbacks
- No code changes; documentation/spec only.

## Impact

- Non-breaking. Improves testability and clarity for future changes.
- Enables `openspec validate` to guard against accidental behavior drift.

## Acceptance Criteria

- `openspec validate add-baseline-specs-frontend-existing-features --strict` passes.
- Each Requirement includes at least one `#### Scenario:`.
- File encoding is UTF-8 (LF) to avoid garbled multi-byte text.

## Risks / Mitigations

- Risk: Spec wording diverges from actual behavior.
  - Mitigation: Keep scenarios concrete and verifiable; iterate after validation runs against app/tests.

## Rollout

1) Approve proposal.
2) Keep change active while aligning tests/UX as needed.
3) After deployment, archive via `openspec archive add-baseline-specs-frontend-existing-features --skip-specs --yes` or merge into `openspec/specs/frontend/spec.md` per project policy.

